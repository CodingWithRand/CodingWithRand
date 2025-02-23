"use client"
import "./page.css";
import Client from "@/glient/util";

export default function Lounge() {
  const { Components } = Client
  const { NavBar } = Components
  return (
    <>
      <NavBar/>
      <main>
        <section className="full-page" style={{ zIndex: 0 }}>
          <div className="relative z-10 bg-[#0F0F0F]/2">
            
          </div>
          <iframe className="full-page" style={{ pointerEvents: "none" }} src="https://www.youtube.com/embed/Na0w3Mz46GA?si=GRuvjOuzyB_UJo34&amp;autoplay=1&amp;loop=1&amp;mute=1&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </section>
        <section className="full-page">
          
        </section>
      </main>
    </>
  );
}

