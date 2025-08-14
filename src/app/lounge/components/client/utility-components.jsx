import Client from "@/glient/util";
import { flushSync } from "react-dom";
import { useContext, useState, useRef, createContext, useEffect } from "react";
import musicId from "../musicId.json";
import Cookies from "universal-cookie";

import { extend } from "@pixi/react";
import { Graphics, Rectangle } from "pixi.js";

extend({ Graphics });

const MusicState = createContext(undefined);

export function MusicStateProvider({ children }){
    const cookies = new Cookies();
    const [ isPlaying, setIsPlaying ] = useState({ 
        playlist: undefined,
        music: undefined,
        category: undefined,
        subcategory: undefined,
        globallyRandom: true,
        state: false,
        volume: [100],
    });
    const [ speakerUniqueId, setSpeakerUniqueId ] = useState("speaker");
    const [ currentSearching, setCS ] = useState({ cate: undefined, lib: undefined });
    const [ showingList, setShowingList ] = useState([]);
    const toasterPlayer = useRef(null);

    useEffect(() => {
        cookies.set("volume", isPlaying.volume[0], { path: "/" });
        if(toasterPlayer.current){
            toasterPlayer.current.setVolume(isPlaying.volume[0]);
        }
    }, [isPlaying.volume])

    return (
        <MusicState.Provider value={{ 
            isPlayingState: {isPlaying, setIsPlaying },
            player: toasterPlayer,
            speakerUID: {speakerUniqueId, setSpeakerUniqueId },
            cs: {currentSearching, setCS},
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

export function CategoryTitle({ text, fontSize }){
    return(
        <div className="flex">
            <div className="ml-4 text-white _90deg-flipped-ccw-text">
                <div className="body-text" style={{ fontSize: fontSize ? fontSize : "2rem" }}>
                    {text}
                </div>
            </div>
            <div className="vr"></div>
        </div>
    )
}

export function PlaylistLibCard({ cate, name, backdropColor }){
    const { Image } = Client.Components.Dynamic
    const { cs, mlList } = useMusic();
    const { setCS } = cs;
    const { setShowingList } = mlList;

    return <div className="playlist-item">
        <div className="playlist-cover" style={{ boxShadow: `20px 20px 0 ${backdropColor}` }} onClick={() => {
            setShowingList((() => {
                let list = [];
                Object.keys(musicId[cate][name]).forEach((musicName, i) => list.push(<MusicCard key={musicName} nth={i} musicName={musicName} />))
                return list
            })())
            setCS({ cate, lib: name });
            document.getElementById("music-library").style.display = "block"
        }}>
            <Image name={`${name}.jpg`} alt={name} dir="playlist-covers/" constant />
        </div>
        <h3 className="text-center text-white font-comic-relief text-lg sm:text-xl mt-8">{name}</h3>
    </div>
}

export function getRandomMusic(cate=undefined, playlist=undefined, music=undefined){
    const categories = Object.keys(musicId);
    const randomCategory = cate || categories[Math.floor(Math.random() * categories.length)];
    const playlists = Object.keys(musicId[randomCategory]);
    const randomPlaylist = playlist || playlists[Math.floor(Math.random() * playlists.length)];
    const musics = Object.keys(musicId[randomCategory][randomPlaylist]);
    const randomMusic = music || musics[Math.floor(Math.random() * musics.length)];
    return { playlist: randomPlaylist, music: randomMusic, id: musicId[randomCategory][randomPlaylist][randomMusic] };
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

export function playMusic({ 
    c, 
    playlist, 
    music, 
    id, 
    recursiveFunction, 
    isRfDOMEvent=false, 
    rfParams=undefined,
    subcategory=undefined, 
    globallyRandom=false 
}, constant){
    const cookies = new Cookies();
    console.log(playlist)
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
                    console.log("play", cookies.get("volume"))
                    event.target.mute();
                    event.target.playVideo();
                    event.target.setVolume(cookies.get("volume"));
                },
                onStateChange: (event) => {
                    console.log(event.data, new Date(Date.now()).toLocaleTimeString());
                    event.target.unMute();
                    if (event.data === YT.PlayerState.PAUSED) {
                        constant.setIsPlaying((prev) => ({ ...prev, state: false })); 
                    }
                    else if (event.data === YT.PlayerState.ENDED) {
                        if(!recursiveFunction) constant.setIsPlaying((prev) => ({ ...prev, state: false })); 
                        if(rfParams){
                            if(isRfDOMEvent) recursiveFunction(constant.e, ...rfParams);
                            else recursiveFunction(...rfParams);
                        }
                        else recursiveFunction(constant.e);
                    }
                }
            }
        })
        constant.setIsPlaying((prev) => ({...prev, playlist, music, state: true, category: c, subcategory, globallyRandom }));
        constant.player.current = window.currentPlayer;
    }
}

export function nextMusicInLib(playlist, currentIndex, ids, names, cate, constant){
    console.log(constant)
    if(currentIndex === ids.length - 1) currentIndex = -1;
    playMusic({
        c: "Normal",
        playlist,
        music: names[currentIndex + 1],
        id: ids[currentIndex + 1],
        recursiveFunction: nextMusicInLib,
        rfParams: [ playlist, currentIndex + 1, ids, names, cate, constant ],
        subcategory: cate,
    }, constant)
}

export function MusicLibraryCard({ nth, matchedSearch, cate, libName }){
    const { isPlayingState, player, speakerUID, cs, mlList } = useMusic();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const { setShowingList } = mlList;
    const { setSpeakerUniqueId } = speakerUID;
    const { setCS } = cs;
    const { Image } = Client.Components.Dynamic

    let constant = { isPlaying, setIsPlaying, player, setSpeakerUniqueId };

    function playRandomlyInLib(e){
        setIsPlaying((prev) => ({...prev, state: false}));
        if(player.current) player.current.pauseVideo();
        constant["e"] = e
        let musicMetadata;
        if(cate && !libName) musicMetadata = getRandomMusic(cate)
        else if(cate && libName) musicMetadata = getRandomMusic(cate, libName);
        const { playlist, music, id } = musicMetadata;
        playMusic({ 
            c: "Random",
            playlist, music, id, 
            recursiveFunction: playRandomlyInLib,
            subcategory: cate
        }, constant)
    }

    function browseLib(){
        if(cate && !libName){
            setShowingList((() => {
                let list = [];
                Object.keys(musicId[cate]).forEach((lName, i) => list.push(<MusicLibraryCard key={`${cate}-${lName}`} nth={i} cate={cate} libName={lName} />))
                return list
            })())
            setCS({ cate, lib: undefined })
        }else if(cate && libName){
            setShowingList((() => {
                let list = [];
                Object.keys(musicId[cate][libName]).forEach((musicName, i) => list.push(<MusicCard key={musicName} nth={i} musicName={musicName} />))
                return list
            })())
            setCS((prev) => ({ ...prev, lib: libName }))
        }
    }

    return <div id={cate && libName ? libName : cate} className="music-lib">
        <span className="text-sm nmob:text-base">
            <span className="nth">{nth + 1}</span>
            <span>
            {
                cate && libName ? 
                    (matchedSearch && !(matchedSearch.every((match) => match === ""))) ? (() => {
                        const regex = new RegExp(matchedSearch.join("|"), "g");
                        // Use replace to wrap matched characters
                        let idx = 0;
                        const highlighted = [];
                        libName.replace(regex, (match, offset) => {
                            // Push text before match
                            if (offset > idx) highlighted.push(libName.slice(idx, offset));
                            // Push highlighted match
                            highlighted.push(
                                <mark key={offset}>{match}</mark>
                            );
                            idx = offset + match.length;
                            return match;
                        });
                        // Push remaining text
                        if (idx < libName.length) highlighted.push(libName.slice(idx));
                        return highlighted;
                    })() : libName
                : 
                    (matchedSearch && !(matchedSearch.every((match) => match === ""))) ? (() => {
                        const regex = new RegExp(matchedSearch.join("|"), "g");
                        // Use replace to wrap matched characters
                        let idx = 0;
                        const highlighted = [];
                        cate.replace(regex, (match, offset) => {
                            // Push text before match
                            if (offset > idx) highlighted.push(cate.slice(idx, offset));
                            // Push highlighted match
                            highlighted.push(
                                <mark key={offset}>{match}</mark>
                            );
                            idx = offset + match.length;
                            return match;
                        });
                        // Push remaining text
                        if (idx < cate.length) highlighted.push(cate.slice(idx));
                        return highlighted;
                    })() : cate
            }
            </span>
        </span>
        <div className="flex flex-row gap-x-2 items-center" style={{ minWidth: "80px" }}>
            <button className="round-btn" style={{ padding: "0.5rem" }} onClick={browseLib}>
                <Image name="search-interface-symbol.png" alt="search" dir="icon/" width={20} height={20} constant />
            </button>
            <button className="round-btn random-play" style={{ padding: "0.5rem" }} onClick={playRandomlyInLib}>
                <DiceSVG width={20} height={20} number={2} />
            </button>
        </div>
    </div>
}

export function MusicCard({ nth, musicName, matchedSearch=undefined }){

    const { isPlayingState, player, speakerUID, cs } = useMusic();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const { setSpeakerUniqueId } = speakerUID;
    const { currentSearching } = cs;

    let constant = { isPlaying, setIsPlaying, player, setSpeakerUniqueId};
    
    function playMusicInLib(e){
        setIsPlaying((prev) => ({...prev, state: false}));
        if(player.current) player.current.pauseVideo();
        constant["e"] = e
        const ids = Object.values(musicId[currentSearching.cate][currentSearching.lib]);
        const names = Object.keys(musicId[currentSearching.cate][currentSearching.lib]);
        let currentIndex = names.indexOf(musicName);

        playMusic({ 
            c: "Normal",
            playlist: currentSearching.lib,
            music: musicName,
            id: musicId[currentSearching.cate][currentSearching.lib][musicName],
            recursiveFunction: nextMusicInLib,
            rfParams: [ currentSearching.lib, currentIndex, ids, names, currentSearching.cate, constant ],
            subcategory: currentSearching.cate
        }, constant)
    }

    return <div id={musicName} className="music-card">
        <span className="text-sm nmob:text-base">
            <span className="nth">{nth + 1}</span>
            <span>
                {
                    (matchedSearch && !(matchedSearch.every((match) => match === ""))) ? (() => {
                        const regex = new RegExp(matchedSearch.join("|"), "g");
                        // Use replace to wrap matched characters
                        let idx = 0;
                        const highlighted = [];
                        musicName.replace(regex, (match, offset) => {
                            // Push text before match
                            if (offset > idx) highlighted.push(musicName.slice(idx, offset));
                            // Push highlighted match
                            highlighted.push(
                                <mark key={offset}>{match}</mark>
                            );
                            idx = offset + match.length;
                            return match;
                        });
                        // Push remaining text
                        if (idx < musicName.length) highlighted.push(musicName.slice(idx));
                        return highlighted;
                    })() : musicName
                }
            </span>
        </span>
        <div className="flex flex-row gap-x-2 items-center" style={{ minWidth: "36px" }}>
            <button className="round-btn" style={{ padding: "0.5rem" }} onClick={playMusicInLib}>
                <img src="/imgs/backend-images/icon/play-button.png" alt="control-btn" width={20} height={20} />
            </button>
        </div>
    </div>
}

export function Book({
    side,
    position,
    thickness,
    height,
    color,
    event
}){
    return(
        <pixiGraphics
            interactive={true}
            hitArea={new Rectangle(0, 0, thickness, height)}
            onClick={event.onClick}
            onTap={event.onTap}
            cursor="pointer"
            x={position.x}
            y={position.y}
            draw={g => {
                // Book cover
                g.setFillStyle({ color: color.cover });
                g.rect(0, 0, thickness, height);
                g.fill();
                // Book spine (darker)
                g.setFillStyle({ color: color.spine });
                g.rect(0, 0, 6, height);
                g.fill();

                if(side === "left"){
                    // Book top (simulate 3D)
                    g.setFillStyle({ color: 0xffeedd });
                    g.moveTo(0, 0);
                    g.lineTo(thickness, 0);
                    g.lineTo(thickness + 12, -20);
                    g.lineTo(12, -20);
                    g.closePath();
                    g.fill();
                    // Book front
                    g.setFillStyle({ color: color.front });
                    g.moveTo(thickness, 0);
                    g.lineTo(thickness, height);
                    g.lineTo(thickness + 12, height - 20);
                    g.lineTo(thickness + 12, -20);
                    g.closePath();
                    g.fill();
                }
                else if(side === "right"){
                    // Book top (simulate 3D)
                    g.setFillStyle({ color: 0xffeedd });
                    g.moveTo(0, 0);
                    g.lineTo(thickness, 0);
                    g.lineTo(thickness - 12, -20);
                    g.lineTo(-12, -20);
                    g.closePath();
                    g.fill();
                    // Book back
                    g.setFillStyle({ color: color.spine });
                    g.moveTo(0, 0);
                    g.lineTo(0, height);
                    g.lineTo(-12, height - 20);
                    g.lineTo(-12, -20);
                    g.closePath();
                    g.fill();
                }
                
            }}
        />
    )
}