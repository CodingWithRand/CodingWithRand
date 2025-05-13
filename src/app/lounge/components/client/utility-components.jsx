import Client from "@/glient/util";
import { flushSync } from "react-dom";
import { useContext, useState, useRef, createContext, useEffect } from "react";
import musicId from "../musicId";

const MusicState = createContext(undefined);

export function MusicStateProvider({ children }){
    const [ isPlaying, setIsPlaying ] = useState({ 
        playlist: undefined,
        music: undefined,
        category: undefined,
        subcategory: undefined,
        state: false,
        volume: [100],
    });
    const [ speakerUniqueId, setSpeakerUniqueId ] = useState("speaker");
    const [ currentSearchingLib, setCSL ] = useState("");
    const [ showingList, setShowingList ] = useState([]);
    const toasterPlayer = useRef(null);

    useEffect(() => {
        if(toasterPlayer.current) toasterPlayer.current.setVolume(isPlaying.volume[0]);
    }, [isPlaying.volume])

    return (
        <MusicState.Provider value={{ 
            isPlayingState: {isPlaying, setIsPlaying },
            player: toasterPlayer,
            speakerUID: {speakerUniqueId, setSpeakerUniqueId },
            csl: {currentSearchingLib, setCSL},
            mlList: {showingList, setShowingList},
         }}>
            {children}
        </MusicState.Provider>
    )
}

export function useMusic(){
  const context = useContext(MusicState);
  if(!context){
    throw new Error("useMusic must be used within a MusicStateProvider component!");
  };
  return context;
};

export function PlaylistLibCard({ name, backdropColor }){
    const { Image } = Client.Components.Dynamic
    return <div className="playlist-item">
        <div className="playlist-cover" style={{ boxShadow: `20px 20px 0 ${backdropColor}` }}>
            <Image name={`${name}.jpg`} alt={name} dir="playlist-covers/" constant />
        </div>
        <h3 className="text-center text-white font-comic-relief text-xl sm:text-2xl mt-8">{name}</h3>
    </div>
}

export function getRandomMusic(playlist=undefined, music=undefined){
    const playlists = Object.keys(musicId);
    const randomPlaylist = playlist || playlists[Math.floor(Math.random() * playlists.length)];
    const musics = Object.keys(musicId[randomPlaylist]);
    const randomMusic = music || musics[Math.floor(Math.random() * musics.length)];
    return { playlist: randomPlaylist, music: randomMusic, id: musicId[randomPlaylist][randomMusic] };
}

export function DiceSVG({ width, height, number }) {
    return <svg width={width} height={height} id="dice">                              
        <mask id={`dice-reverse-mask-${number}`}>                                
            <rect width={width} height={height} fill="white" />
            <circle cx={width * 1/4} cy={width * 3/4} r={Math.round(width / 10)} fill="black" className="d two three four five six"></circle>
            <circle cx={width * 3/4} cy={width * 1/4} r={Math.round(width / 10)} fill="black" className="d two three four five six"></circle>
        </mask>          
        <rect width={width} height={height} rx={Math.round(width / 10)} ry={Math.round(width / 10)} fill="white" mask={`url(#dice-reverse-mask-${number})`} />
    </svg>
}

export function playMusic({ c, playlist, music, id, recursiveFunction, rfParams=undefined, subcategory=undefined }, constant){
    if(playlist !== constant.isPlaying.playlist || music !== constant.isPlaying.music){
        const uId = `speaker-${Date.now()}`;
        flushSync(() => constant.setSpeakerUniqueId(uId))
        if (window.currentPlayer) {
            window.currentPlayer.destroy();
            window.currentPlayer = null;
        }
        
        // if (window.currentPlayer) window.currentPlayer.loadVideoById(id);
        window.currentPlayer = new YT.Player(uId, {
            videoId: id,
            events: {    
                onReady: (event) => {
                    console.log("play")
                    event.target.playVideo();
                    event.target.setVolume(constant.isPlaying.volume[0]);
                },
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.PAUSED) {
                        constant.setIsPlaying((prev) => ({ ...prev, state: false })); 
                    }
                    else if (event.data === YT.PlayerState.ENDED) {
                        if(!recursiveFunction) constant.setIsPlaying((prev) => ({ ...prev, state: false })); 
                        if(rfParams) recursiveFunction(constant.e, ...rfParams);
                        else recursiveFunction(constant.e);
                    }
                }
            }
        })
        constant.setIsPlaying((prev) => ({...prev, playlist, music, state: true, category: c, subcategory }));
        constant.player.current = window.currentPlayer;
    }
}

export function nextMusicInLib(playlist, currentIndex, ids, names, constant){
    if(currentIndex === ids.length - 1) currentIndex = -1;
    playMusic({
        c: "Normal",
        playlist,
        music: names[currentIndex + 1],
        id: ids[currentIndex + 1],
        recursiveFunction: nextMusicInLib,
        rfParams: [ playlist, currentIndex + 1, ids, names ],
        subcategory: playlist
    }, constant)
}

export function MusicLibraryCard({ libName }){
    const { isPlayingState, player, speakerUID, csl, mlList } = useMusic();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const { setShowingList } = mlList;
    const { setSpeakerUniqueId } = speakerUID;
    const { setCSL } = csl;
    const { Image } = Client.Components.Dynamic

    let constant = { isPlaying, setIsPlaying, player, setSpeakerUniqueId };

    function playRandomlyInLib(e){
        setIsPlaying((prev) => ({...prev, state: false}));
        if(player.current) player.current.pauseVideo();
        constant["e"] = e
        const { playlist, music, id } = getRandomMusic(libName)
        playMusic({ 
            c: "Random",
            playlist, music, id, 
            recursiveFunction: playRandomlyInLib,
            rfParams: [ libName ],
            subcategory: libName
        }, constant)
    }

    function browseLib(){
        setShowingList((() => {
            let list = [];
            for(const musicName of Object.keys(musicId[libName])) list.push(<MusicCard key={musicName} musicName={musicName} />)
            return list
        })())
        setCSL(libName)
    }

    return <div id={libName} className="music-lib">
        <span>{libName}</span>
        <div className="flex flex-row gap-x-2 items-center">
            <button className="round-btn" style={{ padding: "0.5rem" }} onClick={browseLib}>
                <Image name="search-interface-symbol.png" alt="search" dir="icon/" width={20} height={20} constant />
            </button>
            <button className="round-btn random-play" style={{ padding: "0.5rem" }} onClick={playRandomlyInLib}>
                <DiceSVG width={20} height={20} number={2} />
            </button>
        </div>
    </div>
}

export function MusicCard({ musicName }){

    const { isPlayingState, player, speakerUID, csl } = useMusic();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const { setSpeakerUniqueId } = speakerUID;
    const { currentSearchingLib } = csl;

    let constant = { isPlaying, setIsPlaying, player, setSpeakerUniqueId };

    function playMusicInLib(e){
        setIsPlaying((prev) => ({...prev, state: false}));
        if(player.current) player.current.pauseVideo();
        constant["e"] = e
        const ids = Object.values(musicId[currentSearchingLib]);
        const names = Object.keys(musicId[currentSearchingLib]);
        let currentIndex = names.indexOf(musicName);

        playMusic({ 
            c: "Normal",
            playlist: currentSearchingLib,
            music: musicName,
            id: musicId[currentSearchingLib][musicName],
            recursiveFunction: nextMusicInLib,
            rfParams: [ currentSearchingLib, currentIndex, ids, names, constant ],
            subcategory: currentSearchingLib
        }, constant)
    }

    return <div id={musicName} className="music-card">
        <span>{musicName}</span>
        <div className="flex flex-row gap-x-2 items-center">
            <button className="round-btn" style={{ padding: "0.5rem" }} onClick={playMusicInLib}>
                <img src="/imgs/backend-images/icon/play-button.png" alt="control-btn" width={20} height={20} />
            </button>
        </div>
    </div>
}