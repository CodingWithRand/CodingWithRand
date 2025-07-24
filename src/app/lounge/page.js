"use client"
import { TypeAnimation } from "react-type-animation";
import "./page.css";
import Client from "@/glient/util";
import { useEffect } from "react";
import Neutral from "@/geutral/util";
import { LofiRadio, RadioToast, MusicLibrary, BookShelf, MusicLibraryDialog } from "./components/client/constructor-components";
import { MusicStateProvider } from "./components/client/utility-components";
import Script from "next/script";
import { useGlobal } from "@/glient/global";
import musicId from "./components/musicId";

export default function Lounge() {
  const { Components } = Client
  const { NavBar, CWRFooter, Dynamic } = Components
  const { Coroussel, Image } = Dynamic

  const { authUser } = useGlobal();

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
  }, []);

  return (
    <MusicStateProvider>
      <NavBar arbitraryCSSRules={
        <style>{`
          nav, nav ul {
            background-color: #9b3331
          }
          .locked a.reg-btn.si {
            background-color: rgb(218, 140, 139)
          }
          .locked a.reg-btn.si:hover {
            background-color: rgb(168, 106, 105)
          }
          .locked a.reg-btn.su {
            background-color: rgba(192, 84, 82, 1)
          }
            .locked a.reg-btn.su:hover {
            background-color: rgba(150, 64, 62, 1)
          }
        `}</style>
      }/>
      <main style={{ backgroundColor: "rgb(218, 140, 139)"}}>
        <section id="heading-lofi-video" className="full-page">
          <div id="heading-banner" className="full-page absolute z-10">
            <div className="transparent-mask"></div>
            <h1 className="title banner-text text-white">Rand&apos;s Lounge</h1>
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
        <section className="break bg-black">
          <div>
            <div className="flex flex-row items-center justify-evenly">
              <Image id="smile-listen-to-music" alt="smile listen to music" name="smile listen to music.png" dir="stickers/" constant />
              <h1 id="music-on-your-demand" className="relative z-[2] art-text py-[1em] md:py-[2em] font-bangers text-3xl nmob:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1DB954]">Music on your demand!</h1>
            </div>
            {
              !(authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at) &&
              <div className="w-full absolute bottom-0 h-full z-[4]" style={{ backdropFilter: 'blur(1rem)' }}></div>
            }
          </div>
          {
              !(authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at) &&
              <div className="z-[5] locked">
                  <h1>Sign up for more access!</h1>
                  <div className="flex flex-row items-center gap-x-8 my-8">
                    <a className="reg-btn su" href="/registration?page=register">Sign Up</a>
                    <a className="reg-btn si" href="/registration?page=login">Log In</a>
                  </div>
              </div>
          }
        </section>
        {
          (authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at) && <>
            <section id="music">
              <Coroussel
                totalPages={2}
                corousselElements={[
                  <LofiRadio key={1} />,
                  <MusicLibrary key={2} />,
                ]}
                corousselWrappersStyle={[
                  
                ]}
                backgroundImageDir={false}
              />
            </section>
            <section className="break flex flex-col items-center" style={{ backgroundImage: "linear-gradient(black 50%, rgb(169, 95, 47))" }}>
              <div className="w-full flex flex-row items-center justify-evenly">
                <div>
                  <Image id="falling-book" alt="falling book" name="falling-book.png" constant  />
                </div>
                <h1 id="im-a-bookworm" className="relative z-10 art-text py-[1em] md:py-[2em] font-bangers text-3xl nmob:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1DB954]">I&apos;m a bookworm!</h1>
              </div>
              <Image alt="bookpile" name="pile of books.png" style={{ maskImage: "linear-gradient(black 80%, transparent 100%)" }} constant/>
            </section>
            <section className="h-screen w-screen flex items-center justify-center" style={{
              backgroundColor: "rgb(169, 95, 47)",
            }}>
              <Image cls="w-full h-full" alt="old library" name="old-library-bg.jpg" style={{ 
                position: "absolute",
                zIndex: 0,
                maskImage: "linear-gradient(transparent, black 20%)",
                objectFit: "cover",
              }} constant />
              <BookShelf />
            </section>
          </>
        }
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
      <MusicLibraryDialog />
      <RadioToast />
      <Script src="https://www.youtube.com/iframe_api" />
    </MusicStateProvider>
  );
}


