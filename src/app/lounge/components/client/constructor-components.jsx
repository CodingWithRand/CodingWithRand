import Client from "@/glient/util"
import { useRef, useState, useEffect, createContext, useContext } from "react";
import { flushSync } from "react-dom";

const MusicState = createContext(undefined);

export function MusicStateProvider({ children }){
    const [ isPlaying, setIsPlaying ] = useState({ 
        playlist: undefined,
        music: undefined,
        state: false,
    });
    const toasterPlayer = useRef(null);

    return (
        <MusicState.Provider value={{ 
            isPlayingState: {isPlaying, setIsPlaying },
            player: toasterPlayer,
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

export function LofiRadio(){
    const { Image } = Client.Components.Dynamic
    const lofiRadioPlayers = useRef({});
    const { player, isPlayingState } = useMusic();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const [ isIframePlaying, setIsIframePlaying ] = useState({});

    useEffect(() => {
        let isPlayingDict = {}
        for (const playerId of document.querySelectorAll(".lofi-radio")) isPlayingDict[playerId.id] = false;
        setIsIframePlaying(isPlayingDict);
    }, []);

    useEffect(() => {
        if (!isPlaying.playlist || !isPlaying.music) return;
        let iframeId;
        switch (`${isPlaying.playlist} - ${isPlaying.music}`) {
            case "Hip Hop - Relax/Study":
                iframeId = "hh-rs";
                break;
            case "Hip Hop - Sleep/Chill":
                iframeId = "hh-sc";
                break;
            case "Medieval - Medieval":
                iframeId = "medieval";
                break;
            case "Synthwave - Chill/Gaming":
                iframeId = "s-cg";
                break;
            case "Jazz - Chill/Study":
                iframeId = "j-cs";
                break;
        }
        setIsIframePlaying((prev) => ({ ...prev, [iframeId]: isPlaying.state }));
    }, [isPlaying]);

    Client.Hooks.useDelayedEffect(() => {
        if (Object.values(isIframePlaying).every((value) => value === false)){
          document.querySelectorAll(`.control-btn`).forEach((e) => e.style.pointerEvents = "initial");
          return;
        }
        for (const id in isIframePlaying) {
          if (isIframePlaying[id]) continue;
          document.querySelector(`#${id}.control-btn`).style.pointerEvents = "none";
        }
      }, [isIframePlaying], 100);
    
      function selection(e){
        e.target.classList.add("selected");
        e.target.parentElement.querySelector(".radio-name").classList.add("selected");
        e.target.parentElement.parentElement.querySelector(".lofi-radio").classList.add("selected");
      }
    
      function deselection(e){
        if (isIframePlaying[e.target.id]) return;
        e.target.classList.remove("selected");
        e.target.parentElement.querySelector(".radio-name").classList.remove("selected");
        e.target.parentElement.parentElement.querySelector(".lofi-radio").classList.remove("selected");
      }
    
      function setToasterIsPlayingState(iframeId, state){
        switch (iframeId) {
            case "hh-rs":
                setIsPlaying({ playlist: "Hip Hop", music: "Relax/Study", state });
                break;
            case "hh-sc":
                setIsPlaying({ playlist: "Hip Hop", music: "Sleep/Chill", state});
                break;
            case "medieval":
                setIsPlaying({ playlist: "Medieval", music: "Medieval", state });
                break;
            case "s-cg":
                setIsPlaying({ playlist: "Synthwave", music: "Chill/Gaming", state });
                break;
            case "j-cs":
                setIsPlaying({ playlist: "Jazz", music: "Chill/Study", state });
                break;
        }
      }

      function play(e, id){
        for (let i = 0; i < document.querySelectorAll(".control-btn").length; i++){
          const btn = document.querySelectorAll(".control-btn")[i];
          if (btn.id !== id) {
            btn.classList.remove("selected");
            btn.parentElement.querySelector(".radio-name").classList.remove("selected");
            btn.parentElement.parentElement.querySelector(".lofi-radio").classList.remove("selected");
          }
        }
        const cpi = id;
        if (!isIframePlaying[cpi]) {
          if (!lofiRadioPlayers.current[cpi]) {
            lofiRadioPlayers.current[cpi] = new window.YT.Player(cpi, {
              events: {
                onReady: (event) => {
                  event.target.playVideo();
                },
              },
            });
          } else {
            lofiRadioPlayers.current[cpi].playVideo();
          }
          setToasterIsPlayingState(cpi, true);
          player.current = lofiRadioPlayers.current[cpi];
          e.target.classList.add("selected");
          e.target.parentElement.parentElement.querySelector(".radio-name").classList.add("selected");
          document.getElementById(cpi).classList.add("selected");
          document.querySelector(`#${cpi}.control-btn-icon`).src = "/imgs/backend-images/icon/pause.png";
          document.querySelector(".belt").style.animationPlayState = "paused";
          setIsIframePlaying((prev) => ({ ...prev, [cpi]: true }));
        } else {
          lofiRadioPlayers.current[cpi].pauseVideo();
          setToasterIsPlayingState(cpi, false);
          document.querySelector(`#${cpi}.control-btn-icon`).src = "/imgs/backend-images/icon/play-button.png";
          document.querySelector(".belt").style.animationPlayState = "running";
          setIsIframePlaying((prev) => ({ ...prev, [cpi]: false }));
        }
      }

    return(
        <div className="h-full">
            <h2 className="flex items-center justify-center gap-x-4 text-[#dc503b] font-comic-relief h-concerned text-center text-5xl nmob:text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                <Image alt="lofi-girl" name="lofi-girl.png" dir="icon/" constant />
                Lofi Radio
            </h2>
            <div className="conveyor">
                <div className="belt">
                <div className="item gap-y-2">
                    <iframe id="hh-rs" className="relative z-[2] lofi-radio" src="https://www.youtube.com/embed/jfKfPfyJRdk?si=mHRrVpcsmqu6LX6g&amp;controls=0&amp;enablejsapi=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    <div className="relative z-[1] flex flex-col items-center gap-y-2">
                    <h3 className="radio-name font-comic-relief text-white text-lg">Hip Hop: Relax/Study</h3>
                    <button id="hh-rs" className="round-btn control-btn" onClick={(e) => play(e, "hh-rs")} onMouseEnter={selection} onMouseLeave={deselection}>
                        <img id="hh-rs" className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                    </button>
                    </div>
                </div>
                <div className="item gap-y-2">
                    <iframe id="hh-sc" className="relative z-[2] lofi-radio" src="https://www.youtube.com/embed/28KRPhVzCus?si=DeeqcjpuFcDn7yqL&amp;controls=0&amp;enablejsapi=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    <div className="relative z-[1] flex flex-col items-center gap-y-2">
                    <h3 className="radio-name font-comic-relief text-white text-lg">Hip Hop: Sleep/Chill</h3>
                    <button id="hh-sc" className="round-btn control-btn" onClick={(e) => play(e, "hh-sc")} onMouseEnter={selection} onMouseLeave={deselection}>
                        <img id="hh-sc" className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                    </button>
                    </div>
                </div>
                <div className="item gap-y-2">
                    <iframe id="medieval" className="relative z-[2] lofi-radio" src="https://www.youtube.com/embed/IxPANmjPaek?si=sh-RD8AxPgVvLc15&amp;controls=0&amp;enablejsapi=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    <div className="relative z-[1] flex flex-col items-center gap-y-2">
                    <h3 className="radio-name font-comic-relief text-white text-lg">Medieval</h3>
                    <button id="medieval" className="round-btn control-btn" onClick={(e) => play(e, "medieval")} onMouseEnter={selection} onMouseLeave={deselection}>
                        <img id="medieval" className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                    </button>
                    </div>
                </div>
                <div className="item gap-y-2">
                    <iframe id="s-cg" className="relative z-[2] lofi-radio" src="https://www.youtube.com/embed/4xDzrJKXOOY?si=Ecywhf9zr7ThIOMN&amp;controls=0&amp;enablejsapi=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    <div className="relative z-[1] flex flex-col items-center gap-y-2">
                    <h3 className="radio-name font-comic-relief text-white text-lg">Synthwave: Chill/Gaming</h3>
                    <button id="s-cg" className="round-btn control-btn" onClick={(e) => play(e, "s-cg")} onMouseEnter={selection} onMouseLeave={deselection}>
                        <img id="s-cg" className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                    </button>
                    </div>
                </div>
                <div className="item gap-y-2">
                    <iframe id="j-cs" className="relative z-[2] lofi-radio" src="https://www.youtube.com/embed/HuFYqnbVbzY?si=Fh8ftP5L0nl42CCp&amp;controls=0&amp;enablejsapi=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    <div className="relative z-[1] flex flex-col items-center gap-y-2">
                    <h3 className="radio-name font-comic-relief text-white text-lg">Jazz: Chill/Study</h3>
                    <button id="j-cs" className="round-btn control-btn" onClick={(e) => play(e, "j-cs")} onMouseEnter={selection} onMouseLeave={deselection}>
                        <img id="j-cs" className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export function BGMMusic(){
    const { Image } = Client.Components.Dynamic
    const [ uniqueId, setUniqueId ] = useState("speaker");
    const { isPlayingState, player } = useMusic();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const music_id = {
        "Vindsvept": {
            "Sleeper": "VMUzqKy3Xec",
            "Sleeper Pt.2": "LcGSBAYlINI",
            "Reverie Pt.2": "L_z7TBLzfEM",
            "Distant": "toYkSo3-McY",
            "The Fae": "8JFG_bKg5lE",
            "Through the Woods we Ran": "yKizp0pDFtA",
        },
    }
    
    function explain(e){ e.target.querySelectorAll("span").forEach((span) => span.style.display = "inline") }
    function abbreviate(e){ e.target.querySelectorAll("span").forEach((span) => span.style.display = "none") }

    function getRandomMusic(){
        const playlists = Object.keys(music_id);
        const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
        const musics = Object.keys(music_id[randomPlaylist]);
        const randomMusic = musics[Math.floor(Math.random() * musics.length)];
        return { playlist: randomPlaylist, music: randomMusic, id: music_id[randomPlaylist][randomMusic] };
    }

    function playRandomly(e){ 
        console.log(uniqueId, isPlaying)
        const { playlist, music, id } = getRandomMusic();
        const speakerDiv = document.getElementById("speaker-hidden-container").children[0];
        if(playlist !== isPlaying.playlist || music !== isPlaying.music){
            const uId = `speaker-${Date.now()}`;
            speakerDiv.id = uId;
            flushSync(() => {
                setUniqueId(uId);
            });
            if (window.currentPlayer) window.currentPlayer.loadVideoById(id);
            else window.currentPlayer = new YT.Player(uId, {
                videoId: id,
                events: {    
                    onReady: (event) => {
                        console.log("play")
                        event.target.playVideo();
                    },
                    onStateChange: (event) => {
                        if (event.data === YT.PlayerState.ENDED) {
                            playRandomly(e);
                        }
                    }
                }
            })
            flushSync(() => {
                setIsPlaying({ playlist, music, state: true });
            });
            player.current = window.currentPlayer;
        }
    }

    return(
        <div className="flex flex-col items-center h-full relative">
            <h2 className="text-[#9b3331] font-comic-relief py-16 text-center text-5xl nmob:text-6xl sm:text-7xl md:text-8xl lg:text-9xl" onMouseEnter={explain} onMouseLeave={abbreviate} onClick={explain}>
                B
                <span style={{ fontSize: "1rem", display: "none" }}>ack</span>
                G
                <span style={{ fontSize: "1rem", display: "none" }}>round </span>
                M
                <span style={{ fontSize: "1rem", display: "none" }}>usic</span>
            </h2>
            <div id="playlists">
                <div className="playlist-item">
                    <div className="playlist-cover" style={{ boxShadow: "20px 20px 0 #402726" }}>
                        <Image name="vindsvept.jpg" alt="Vindsvept" dir="playlist-covers/" constant />
                    </div>
                    <h3 className="text-white font-comic-relief text-xl sm:text-2xl mt-8">Vindsvept</h3>
                    <div className="flex flex-row gap-x-4">
                        <div className="flex flex-col items-center gap-y-2">
                            <button className="round-btn mt-4">
                                <Image name="search-interface-symbol.png" alt="search" dir="icon/" width={28} height={28} constant />
                            </button>
                            <span className="text-white font-comic-relief">Search</span>
                        </div>
                        <div className="flex flex-col items-center gap-y-2">
                            <button className="round-btn mt-4" onClick={playRandomly}>
                                <svg width="28" height="28" id="dice">                              
                                    <mask id="dice-reverse-mask">                                
                                        <rect width="28" height="28" fill="white" />
                                        <circle cx="7" cy="21" r="3" fill="black" className="d two three four five six"></circle>
                                        <circle cx="21" cy="7" r="3" fill="black" className="d two three four five six"></circle>
                                    </mask>          
                                    <rect width="28" height="28" rx="3" ry="3" fill="white" mask="url(#dice-reverse-mask)" />
                                </svg>
                            </button>
                            <span className="text-white font-comic-relief">Random</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="speaker-hidden-container" className="hidden">
                <div id={uniqueId}></div>
            </div>
        </div>
    )
}

export function RadioToast(){
    const { isPlayingState, player } = useMusic();
    const { isPlaying, setIsPlaying } = isPlayingState;

    Client.Hooks.useDelayedEffect(() => {
        if(!player.current) return;
        if(isPlaying.state){ 
            player.current.playVideo();
        } else {
            player.current.pauseVideo();
        }
    }, [isPlaying.state], 100)

    function playOnToast(e){
        let iframeId;
        switch (`${isPlaying.playlist} - ${isPlaying.music}`) {
            case "Hip Hop - Relax/Study":
                iframeId = "hh-rs";
                break;
            case "Hip Hop - Sleep/Chill":
                iframeId = "hh-sc";
                break;
            case "Medieval - Medieval":
                iframeId = "medieval";
                break;
            case "Synthwave - Chill/Gaming":
                iframeId = "s-cg";
                break;
            case "Jazz - Chill/Study":
                iframeId = "j-cs";
                break;
            default:
                iframeId = "speaker";
        }
        setIsPlaying((prevState) => ({ ...prevState, state: !prevState.state }))
        if(iframeId !== "speaker"){
            if(isPlaying.state){
                document.querySelector(`#${iframeId}.control-btn-icon`).src = "/imgs/backend-images/icon/play-button.png";
                document.querySelector(".belt").style.animationPlayState = "running";
            } else {   
                document.querySelector(`#${iframeId}.control-btn-icon`).src = "/imgs/backend-images/icon/pause.png";
                document.querySelector(".belt").style.animationPlayState = "paused";
            }
        }
    }

    return(
        (isPlaying.playlist && isPlaying.music && player.current) && 

        <div className="toast-container">
            <button onClick={playOnToast} className="toast-btn">
                <img src={`/imgs/backend-images/icon/${isPlaying.state ? "pause" : "play-button"}.png`} alt="control-btn" width={25} height={25} />
            </button>
            <div className="font-comic-relief text-white">{`Now playing: ${isPlaying.playlist} - ${isPlaying.music}`}</div>
        </div>

    )
}