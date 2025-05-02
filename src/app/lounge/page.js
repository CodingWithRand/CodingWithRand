"use client"
import { TypeAnimation } from "react-type-animation";
import "./page.css";
import Client from "@/glient/util";
import { useEffect, useRef, useState } from "react";
import Neutral from "@/geutral/util";
import Script from "next/script";

export default function Lounge() {
  const { Components } = Client
  const { NavBar, CWRFooter, Dynamic } = Components
  const { Coroussel, Image } = Dynamic
  const players = useRef({});
  const [ currentPlayerId, setCurrentPlayerId ] = useState(null);
  const [ isPlaying, setIsPlaying ] = useState({});

  useEffect(() => {
    const headingBannerTitle = document.querySelector("#heading-banner .title");
    const typingText = document.querySelector("#heading-banner .typing-text");
    const blurMask = document.querySelector("#heading-banner .transparent-mask");
    (async () => {
      blurMask.style.opacity = "1";
      await Neutral.Functions.asyncDelay(2000)
      headingBannerTitle.style.opacity = "1";
      headingBannerTitle.style.transform = "translateY(0)";
      await Neutral.Functions.asyncDelay(1000)
      typingText.style.opacity = "1";
    })();
    let isPlayingDict = {}
    for (const playerId of document.querySelectorAll(".lofi-radio")) isPlayingDict[playerId.id] = false;
    setIsPlaying(isPlayingDict);
  }, []);

  Client.Hooks.useDelayedEffect(() => {
    if (Object.values(isPlaying).every((value) => value === false)){
      document.querySelectorAll(`.control-btn`).forEach((e) => e.style.pointerEvents = "initial");
      return;
    }
    for (const id in isPlaying) {
      if (isPlaying[id]) continue;
      document.querySelector(`#${id}.control-btn`).style.pointerEvents = "none";
    }
  }, [isPlaying], 100);

  function selection(e){
    setCurrentPlayerId(e.target.parentElement.parentElement.querySelector(".lofi-radio").id);
    e.target.classList.add("selected");
    e.target.parentElement.querySelector(".radio-name").classList.add("selected");
    e.target.parentElement.parentElement.querySelector(".lofi-radio").classList.add("selected");
  }

  function deselection(e){
    if (isPlaying[currentPlayerId]) return;
    setCurrentPlayerId(null);
    e.target.classList.remove("selected");
    e.target.parentElement.querySelector(".radio-name").classList.remove("selected");
    e.target.parentElement.parentElement.querySelector(".lofi-radio").classList.remove("selected");
  }

  function play(e){
    if (!isPlaying[currentPlayerId]) {
      if (!players.current[currentPlayerId]) {
        players.current[currentPlayerId] = new window.YT.Player(currentPlayerId, {
          events: {
            onReady: (event) => {
              event.target.playVideo();
            },
          },
        });
      } else {
        players.current[currentPlayerId].playVideo();
      }
      e.target.classList.add("selected");
      document.getElementById(currentPlayerId).classList.add("selected");
      document.querySelector(`#${currentPlayerId}.control-btn`).removeEventListener("mouseleave", deselection);
      document.querySelector(`#${currentPlayerId}.control-btn-icon`).src = "/imgs/backend-images/icon/pause.png";
      document.querySelector(".belt").style.animationPlayState = "paused";
      setIsPlaying((prev) => ({ ...prev, [currentPlayerId]: true }));
    } else {
      players.current[currentPlayerId].pauseVideo();
      document.querySelector(`#${currentPlayerId}.control-btn`).addEventListener("mouseleave", deselection);
      document.querySelector(`#${currentPlayerId}.control-btn-icon`).src = "/imgs/backend-images/icon/play-button.png";
      document.querySelector(".belt").style.animationPlayState = "running";
      setIsPlaying((prev) => ({ ...prev, [currentPlayerId]: false }));
    }
  }

  return (
    <>
      <NavBar arbitraryCSSRules={
        <style>{`
          nav, nav ul {
            background-color: #9b3331
          }
        `}</style>
      }/>
      <main style={{ backgroundColor: "rgb(218, 140, 139)"}}>
        <section id="heading-lofi-video" className="full-page">
          <div id="heading-banner" className="full-page absolute z-10">
            <div className="transparent-mask"></div>
            <h1 className="title banner-text text-white">Rand's Lounge</h1>
            <TypeAnimation 
              sequence={[
                "Place to relax your mind, and my mind too.",
                4000,
                "Also great for studying, focusing, and working.",
                4000,
                "Lofi, Medieval, Synthwave, and more.",
                3000,
                "I even have a manga collection here lol.",
                3000,
              ]}
              className="typing-text text-white text-sm nmob:text-lg sm:text-xl md:text-2xl lg:text-4xl font-comic-relief"
              style={{ opacity: 0, transition: "opacity 1s ease-in" }}
              repeat={Infinity}
              deletionSpeed={80}
            />
          </div>
          <iframe className="full-page" src="https://www.youtube.com/embed/Na0w3Mz46GA?si=GRuvjOuzyB_UJo34&amp;autoplay=1&amp;loop=1&amp;mute=1&amp;controls=0&amp;rel=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </section>
        <section className="break bg-black flex flex-row items-center justify-evenly">
          <Image alt="smile listen to music" name="smile listen to music.png" dir="stickers/" constant />
          <h1 id="music-on-your-demand" className="relative z-10 art-text py-[1em] md:py-[2em] font-bangers text-3xl nmob:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1DB954]">Music on your demand!</h1>
        </section>
        <section id="music">
          <Coroussel
            totalPages={2}
            corousselElements={[
              <div key={1} className="h-full">
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
                        <button id="hh-rs" className="control-btn" onClick={play} onMouseEnter={selection} onMouseLeave={deselection}>
                          <img id="hh-rs" className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                        </button>
                      </div>
                    </div>
                    <div className="item gap-y-2">
                      <iframe id="hh-sc" className="relative z-[2] lofi-radio" src="https://www.youtube.com/embed/28KRPhVzCus?si=DeeqcjpuFcDn7yqL&amp;controls=0&amp;enablejsapi=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                      <div className="relative z-[1] flex flex-col items-center gap-y-2">
                        <h3 className="radio-name font-comic-relief text-white text-lg">Hip Hop: Sleep/Chill</h3>
                        <button id="hh-sc" className="control-btn" onClick={play} onMouseEnter={selection} onMouseLeave={deselection}>
                          <img id="hh-sc" className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                        </button>
                      </div>
                    </div>
                    <div className="item gap-y-2">
                      <iframe id="medieval" className="relative z-[2] lofi-radio" src="https://www.youtube.com/embed/IxPANmjPaek?si=sh-RD8AxPgVvLc15&amp;controls=0&amp;enablejsapi=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                      <div className="relative z-[1] flex flex-col items-center gap-y-2">
                        <h3 className="radio-name font-comic-relief text-white text-lg">Medieval</h3>
                        <button id="medieval" className="control-btn" onClick={play} onMouseEnter={selection} onMouseLeave={deselection}>
                          <img id="medieval" className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                        </button>
                      </div>
                    </div>
                    <div className="item gap-y-2">
                      <iframe id="s-cg" className="relative z-[2] lofi-radio" src="https://www.youtube.com/embed/4xDzrJKXOOY?si=Ecywhf9zr7ThIOMN&amp;controls=0&amp;enablejsapi=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                      <div className="relative z-[1] flex flex-col items-center gap-y-2">
                        <h3 className="radio-name font-comic-relief text-white text-lg">Synthwave: Chill/Gaming</h3>
                        <button id="s-cg" className="control-btn" onClick={play} onMouseEnter={selection} onMouseLeave={deselection}>
                          <img id="s-cg" className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                        </button>
                      </div>
                    </div>
                    <div className="item gap-y-2">
                      <iframe id="j-cs" className="relative z-[2] lofi-radio" src="https://www.youtube.com/embed/HuFYqnbVbzY?si=Fh8ftP5L0nl42CCp&amp;controls=0&amp;enablejsapi=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                      <div className="relative z-[1] flex flex-col items-center gap-y-2">
                        <h3 className="radio-name font-comic-relief text-white text-lg">Jazz: Chill/Study</h3>
                        <button id="j-cs" className="control-btn" onClick={play} onMouseEnter={selection} onMouseLeave={deselection}>
                          <img id="j-cs" className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <Script src="https://www.youtube.com/iframe_api" />
                </div>
              </div>,
              <div key={2}>
                <h2 className="text-[#9b3331] font-comic-relief py-16 text-center text-5xl nmob:text-6xl sm:text-7xl md:text-8xl lg:text-9xl">Medieval Music</h2>
              </div>
            ]}
            corousselWrappersStyle={[
              
            ]}
            backgroundImageDir={false}
          />
        </section>
      </main>
      <CWRFooter arbitraryCSSRules={
        <style>{`
          footer {
            background-color: rgb(155, 51, 49)
          }
          footer > :last-child {
            background-image: linear-gradient(to bottom, transparent, #ffa0cf)
          }

        `}</style>
      } />
    </>
  );
}


