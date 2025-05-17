import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite, Texture, Assets } from "pixi.js";

import Client from "@/glient/util";
import { useRef, useState, useEffect } from "react";
import musicId from "../musicId";
import { Direction, Range } from "react-range";
import { useGlobal } from "@/glient/global";
import { useMusic, DiceSVG, playMusic, getRandomMusic, nextMusicInLib, PlaylistLibCard, MusicLibraryCard, MusicCard } from "./utility-components";

extend({
    Container,
    Graphics,
    Sprite,
})

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
        if (isPlaying.category !== "Lofi Radio") return;
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
    }, [isPlaying.playlist, isPlaying.music]);

    Client.Hooks.useDelayedEffect(() => {
        if (isPlaying.category !== "Lofi Radio") return;
        if (Object.values(isIframePlaying).every((value) => value === false)){
          document.querySelectorAll(`.control-btn`).forEach((e) => e.style.pointerEvents = "initial");
          return;
        }
        for (const id in isIframePlaying) {
          if (isIframePlaying[id]) continue;
          document.querySelector(`#${id}.control-btn`).style.pointerEvents = "none";
        }
      }, [isIframePlaying, isPlaying.category], 100);
    
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
                setIsPlaying((prev) => ({...prev, playlist: "Hip Hop", music: "Relax/Study", state, category: "Lofi Radio", subcategory: undefined }));
                break;
            case "hh-sc":
                setIsPlaying((prev) => ({...prev, playlist: "Hip Hop", music: "Sleep/Chill", state, category: "Lofi Radio", subcategory: undefined }));
                break;
            case "medieval":
                setIsPlaying((prev) => ({...prev, playlist: "Medieval", music: "Medieval", state, category: "Lofi Radio", subcategory: undefined }));
                break;
            case "s-cg":
                setIsPlaying((prev) => ({...prev, playlist: "Synthwave", music: "Chill/Gaming", state, category: "Lofi Radio", subcategory: undefined }));
                break;
            case "j-cs":
                setIsPlaying((prev) => ({...prev, playlist: "Jazz", music: "Chill/Study", state, category: "Lofi Radio", subcategory: undefined }));
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
                  event.target.setVolume(isPlaying.volume[0]);
                },
                onStateChange: (event) => {
                  if (event.data === window.YT.PlayerState.PAUSED) {
                    setIsIframePlaying((prev) => ({ ...prev, [cpi]: false }));
                  }
                },
              }
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
          setIsIframePlaying((prev) => ({ ...prev, [cpi]: false }));
        }
      }

    return(
        <div className="h-full">
            <h2 className="flex items-center justify-center gap-x-4 text-[#dc503b] font-comic-relief h-concerned text-center text-5xl nmob:text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                <Image alt="lofi-girl" name="lofi-girl.png" dir="icon/" constant />
                Lofi Radio
            </h2>
            <div className="conveyor h-[60%] w-full">
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
    const { isPlayingState, speakerUID, player } = useMusic();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const { speakerUniqueId, setSpeakerUniqueId } = speakerUID;

    let constant = { isPlaying, setIsPlaying, player, setSpeakerUniqueId };
    
    function explain(e){ e.target.querySelectorAll("span").forEach((span) => span.style.display = "inline") }
    function abbreviate(e){ e.target.querySelectorAll("span").forEach((span) => span.style.display = "none") }

    function playRandomly(e){ 
        setIsPlaying((prev) => ({...prev, state: false}));
        if(player.current) player.current.pauseVideo();
        constant["e"] = e;
        const { playlist, music, id } = getRandomMusic();
        playMusic({ 
            c: "Random",
            playlist, music, id, 
            recursiveFunction: playRandomly, 
        }, constant);
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
            <div className="conveyor overflow-auto" id="playlists">
                <div></div>
                <PlaylistLibCard name="DM DOKURO Calamity Mod" backdropColor="#A038C8" />
                <PlaylistLibCard name="Vindsvept" backdropColor="#402726" />
                <PlaylistLibCard name="A Hat in Time" backdropColor="#6070A0" />
                <PlaylistLibCard name="A Hat in Time (Seal the Deal)" backdropColor="#803800" />
                <div></div>
            </div>
            <div className="flex flex-row gap-x-4">
                <div className="flex flex-col items-center gap-y-2">
                    <button className="round-btn mt-4" onClick={() => document.getElementById("music-library").showModal()}>
                        <Image name="search-interface-symbol.png" alt="search" dir="icon/" width={28} height={28} constant />
                    </button>
                    <span className="text-white font-comic-relief">Search</span>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                    <button className="random-play round-btn mt-4" onClick={playRandomly}>
                        <DiceSVG width={28} height={28} number={1} />
                    </button>
                    <span className="text-white font-comic-relief">Random</span>
                </div>
            </div>
            <div id="speaker-hidden-container">
                <div id={speakerUniqueId}></div>
            </div>
        </div>
    )
}

export function RadioToast(){
    const { isPlayingState, player, speakerUID } = useMusic();
    const { device } = useGlobal();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const { setSpeakerUniqueId } = speakerUID;
    const { Image } = Client.Components.Dynamic

    let constant = { isPlaying, setIsPlaying, player, setSpeakerUniqueId };

    Client.Hooks.useDelayedEffect(() => {
        if(!player.current) return;
        if(isPlaying.state){ 
            player.current.playVideo();
        } else {
            player.current.pauseVideo();
        }
    }, [isPlaying.state], 100)

    useEffect(() => {
        if (!isPlaying.state){
            document.querySelector(".belt").style.animationPlayState = "running";
            document.querySelectorAll(".control-btn-icon").forEach((cbi) => {
                cbi.src = "/imgs/backend-images/icon/play-button.png"
            });
            document.querySelectorAll(".control-btn").forEach((cb) => {
                cb.src = "/imgs/backend-images/icon/play-button.png"
                cb.classList.remove("selected")
            });
            document.querySelectorAll(".lofi-radio").forEach((lr) => {
                lr.classList.remove("selected")
            });
            document.querySelectorAll(".radio-name").forEach((rn) => {
                rn.classList.remove("selected")
            });
        }

        if (isPlaying.state && isPlaying.category !== "Lofi Radio"){
            document.querySelectorAll(".control-btn").forEach((e) => e.style.pointerEvents = "none");
        } else if (!isPlaying.state && isPlaying.category !== "Lofi Radio") {
            document.querySelectorAll(".control-btn").forEach((e) => e.style.pointerEvents = "initial");
        }
    }, [isPlaying.state, isPlaying.category])

    useEffect(() => {
        let showNameTimeout;
        let hideNameTimeout;
        if(device.device !== "lg" && device.device !== "xl" && device.device !== "2xl"){
            showNameTimeout = setTimeout(() => document.getElementById("mn-dialog").show(), 100);
            hideNameTimeout = setTimeout(() => document.getElementById("mn-dialog").close(), 3100);
        } else {
            showNameTimeout = setTimeout(() => document.getElementById("music-name").style.width = `${160 + ((isPlaying.playlist.length + isPlaying.music.length) * 10)}px`, 100);
            hideNameTimeout = setTimeout(() => document.getElementById("music-name").style.width = 0, 3100);
        }
        return () => {
            clearTimeout(showNameTimeout);
            clearTimeout(hideNameTimeout);
        }
    }, [isPlaying.playlist, isPlaying.music, device.device]);


    function isLofiRadio(){
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
        return [iframeId, iframeId !== "speaker"];
    }

    function playOnToast(e){
        let iframeId = isLofiRadio()[0];
        setIsPlaying((prevState) => ({ ...prevState, state: !prevState.state }))
        if(isLofiRadio()[1]){
            if(isPlaying.state){
                document.querySelector(`#${iframeId}.control-btn-icon`).src = "/imgs/backend-images/icon/play-button.png";
                document.querySelector(".belt").style.animationPlayState = "running";
            } else {   
                document.querySelector(`#${iframeId}.control-btn-icon`).src = "/imgs/backend-images/icon/pause.png";
                document.querySelector(".belt").style.animationPlayState = "paused";
            }
        }
    }

    function skipOnToast(e){
        if(isPlaying.category === "Lofi Radio") return;
        else if(isPlaying.category === "Random") {
            if(isPlaying.subcategory) document.getElementById(isPlaying.subcategory).querySelector(".random-play").click();
            else document.querySelector(".random-play").click();
        }
        else if(isPlaying.category === "Normal") {
            if(isPlaying.subcategory){
                constant["e"] = e
                const names = Object.keys(musicId[isPlaying.playlist]);
                nextMusicInLib(isPlaying.playlist, names.indexOf(isPlaying.music), Object.values(musicId[isPlaying.playlist]), names, constant);
            }
        }
    }

    return(
        (isPlaying.playlist && isPlaying.music) && 

        <div className="toast-container">
            <button onClick={playOnToast} className="toast-btn">
                <img src={`/imgs/backend-images/icon/${isPlaying.state ? "pause" : "play-button"}.png`} alt="control-btn" width={25} height={25} />
            </button>
            <button id="skip-play-btn" disabled={isPlaying.category === "Lofi Radio" ? true : false} onClick={skipOnToast}>
                <Image name="next-button.png" alt="next-play-btn" dir="icon/" width={25} height={25} constant />
            </button>
            <button id="show-mn-btn" onClick={() => {
                if(document.getElementById("mn-dialog").open) document.getElementById("mn-dialog").close();
                else document.getElementById("mn-dialog").show()
            }}>
                <Image name="name-tag.png" alt="name-tag" dir="icon/" width={25} height={25} constant />
            </button>
            <button onClick={() => {
                if(document.getElementById("volume-slider").style.display === "block") document.getElementById("volume-slider").style.display = "none";
                else document.getElementById("volume-slider").style.display = "block"
            }}>
                <img src={`/imgs/backend-images/icon/${isPlaying.volume[0] === 0 ? "muted" : "audio"}.png`} alt="volume-btn" width={25} height={25} />
                <div id="volume-slider" style={{ display: "none" }}>
                <Range
                    direction={Direction.Up}
                    min={0}
                    max={100}
                    step={1}
                    values={isPlaying.volume}
                    onChange={(values) => setIsPlaying((prev) => ({...prev, volume: values }))}
                    renderTrack={({ props, children }) => (
                        <div
                        {...props}
                        style={{
                            ...props.style,
                            height: "50px",
                            width: "6px",
                            borderRadius: "9999px",
                            backgroundColor: "#fff",
                        }}
                        >
                        {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div
                        {...props}
                        key={props.key}
                        style={{
                            ...props.style,
                            height: "15px",
                            width: "15px",
                            borderRadius: "9999px",
                            backgroundColor: "#999",
                        }}
                        />
                    )}
                />
            </div>
            </button>
            <div id="music-name" style={{ width: 0 }} className="font-comic-relief text-white">{`Now playing: ${isPlaying.playlist} - ${isPlaying.music}`}</div>
            <dialog id="mn-dialog">
                <div>{`Now playing: ${isPlaying.playlist} - ${isPlaying.music}`}</div>
            </dialog>
        </div>

    )
}

export function MusicLibrary(){
    const { Image } = Client.Components.Dynamic
    const { csl, mlList } = useMusic();
    const { showingList, setShowingList } = mlList;
    const { currentSearchingLib, setCSL } = csl;

    function showAllLib(){
        let list = [];
        for(const libName of Object.keys(musicId)) list.push(<MusicLibraryCard key={libName} libName={libName} />)
        return list
    }

    function searchCheck(e){
        setShowingList((() => {
            let list = [];
            if (currentSearchingLib === ""){ 
                for(const libName of Object.keys(musicId)){
                    const searchPattern = new RegExp(`^${e.target.value.toLowerCase()}`)
                    if(searchPattern.test(libName.toLowerCase())) list.push(<MusicLibraryCard key={libName} libName={libName} />)
                }
            } else {
                for(const musicName of Object.keys(musicId[currentSearchingLib])){
                    const searchPattern = new RegExp(`^${e.target.value.toLowerCase()}`)
                    if(searchPattern.test(musicName.toLowerCase())) list.push(<MusicCard key={musicName} musicName={musicName} />)
                }
            }
            
            return list
        })())
    }

    useEffect(() => setShowingList(showAllLib()), [])

    return(
        <dialog id="music-library">
            <div className="music-library-container">
                <div className="flex flex-col w-full items-center">
                    <div id="lib-search-bar">
                        <input placeholder="Search for music here" onChange={searchCheck} type="text"/>
                        <Image name="search-interface-symbol.png" alt="search" dir="icon/" width={28} height={28} constant />
                    </div>
                    <div className="lib-list">
                        {showingList}
                    </div>
                </div>
                
                <div className="flex flex-row justify-center gap-x-4">
                    { currentSearchingLib !== "" &&
                        <button onClick={() => { setCSL(""); setShowingList(showAllLib()) }}>
                            <Image name="left-arrow.png" alt="left-arrow" dir="icon/" width={28} height={28} constant />
                        </button>
                    }
                    <button onClick={() => document.getElementById("music-library").close()}>
                        <Image name="close.png" alt="close" dir="icon/" width={28} height={28} constant />
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export function BookShelf(){
    const parent = useRef(null);
    const [ textures, setTextures ] = useState(Texture.EMPTY);
    const [ spriteSizes, setSpriteSizes ] = useState({
        bookshelf: {
            
        }
    });

    useEffect(() => {
        (async () => {
            await Assets.init({ manifest: "/asset-bundles-manifest.json" })
            if (textures === Texture.EMPTY) {
                Assets
                    .loadBundle("library")
                    .then((loaded) => {
                        setTextures(loaded)
                    })
            }
        })()
    }, []);


    return (
        // <div className="h-[80%] w-[80%]" ref={parent}>
        //     <Application resizeTo={parent}>
        //                 <pixiContainer x={0} y={0}>
        //                     <pixiSprite texture={textures.bookshelf} x={0} y={0} scale={0.125}/>
        //                     <pixiSprite texture={textures.bookshelf} x={600} y={0} scale={0.125}/>
        //                 </pixiContainer>
        //     </Application>
        // </div>
        <></>
    )
}