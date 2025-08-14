import "./page.css"

export default function MyCV() {
  // One of my assignments in college which is to create a CV using HTML and CSS only.
  // So, no React, no Next.js, no Tailwind CSS (just yet), just pure HTML and CSS.
  // Will implement those soon.
  return (
    <>
      <nav id="cv-nav">
        <div className="flex flex-row items-center nav-wrapper" style={{ borderBottom: "2px solid black" }}>
          <div id="personalization" className="flex flex-row items-center">
            <button>
              <img id="theme-controller" src="/imgs/backend-images/theme/icon/light-mode.png" alt="light-mode"></img>
            </button>
            <div id="logo-for-cv" className="flex flex-row items-center">
              <img src="/imgs/backend-images/channel_logo_new.png" alt="my-logo"></img>
              <span className="font-roboto-mono">RAND0M</span>
            </div>
            <div id="lang-selection" className="font-roboto-mono">
              <a href="?lang=en" className="selected lang">EN</a>
              <a href="?lang=th">TH</a>
            </div>
          </div>
          <div id="menu" className="flex flex-row">
            <a href="#about-me">ABOUT ME</a>
            <a href="#skills">SKILLS</a>
            <a href="#experiences">EXPERIENCES</a>
            <a href="#portfolio">PORTFOLIO</a>
            <a href="#certificates">CERTIFICATES</a>
          </div>
        </div>
      </nav>
      <header>
        <div className="font-roboto-mono text-center">
          <span className="inline-block dq-left">"</span>
          <div className="inline-block animated-text">
            <span className="inline-block">YOUNG</span> 
          </div>
          <span> & </span>
          <div className="inline-block animated-text">
            <span className="inline-block">AMBITIOUS</span> 
          </div>
          <span>&nbsp;</span>
          <span>Junior Developer</span>
          <span className="inline-block dq-right">"</span>
        </div>
      </header>
      <main>
        <section id="pfp-c-s">
          <img className="pfp" style={{ margin: "1rem 0" }} src="/imgs/backend-images/ธัญวิสิฏฐ์ อังสาชน.jpg" alt="me"></img>
          <h1 id="my-name" className="font-m-plus _0-md">Thanwisit Angsachon</h1>
          <h2 className="block-title font-sansation">CONTACT</h2>
          <div id="contact" className="flex flex-col">
            <div className="contact-info flex">
              <img src="/imgs/backend-images/cv/call.svg" alt="tel"></img>
              <span>096 004 2389</span>
            </div>
            <div className="contact-info flex">
              <img src="/imgs/backend-images/cv/mail.svg" alt="email"></img>
              <a href="mailto:thanwisitang7910@gmail">thanwisitang7910@gmail.com</a>
            </div>
            <div className="contact-info flex">
              <img src="/imgs/backend-images/cv/website.svg" alt="website"></img>
              <a href="https://codingwithrand.vercel.app" target="_blank">codingwithrand.vercel.app</a>
            </div>
          </div>
          <h2 className="block-title font-sansation">SKILLS</h2>
          <div id="skills" className="flex flex-col">
            <div className="skill-list">
              <h3 className="font-roboto-mono"><b>Programming Languages</b></h3>
              <div id="pl" className="gauge-list">
                <div className="flex flex-col items-center">
                  <div id="css" className="gauge">
                    <img src="/imgs/backend-images/icon/css.png" alt="css"></img>
                    <div className="img-backdrop font-sansation">70%</div>
                  </div>
                  <span>CSS</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="js" className="gauge">
                    <img src="/imgs/backend-images/icon/js.png" alt="js"></img>
                    <div className="img-backdrop font-sansation">60%</div>
                  </div>
                  <span>Javascript</span>
                </div>
                <div className="flex flex-col items-center">  
                  <div id="lua" className="gauge">
                    <img src="/imgs/backend-images/icon/lua.png" alt="lua"></img>
                    <div className="img-backdrop font-sansation">60%</div>
                  </div>
                  <span>Lua</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="html" className="gauge">
                    <img src="/imgs/backend-images/icon/html.png" alt="html"></img>
                    <div className="img-backdrop font-sansation">50%</div>
                  </div>
                  <span>HTML</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="py" className="gauge">
                    <img src="/imgs/backend-images/icon/py.png" alt="py"></img>
                    <div className="img-backdrop font-sansation">50%</div>
                  </div>
                  <span>Python</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="java" className="gauge">
                    <img src="/imgs/backend-images/icon/java.png" alt="java"></img>
                    <div className="img-backdrop font-sansation">25%</div>
                  </div>
                  <span>Java</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="ts" className="gauge">
                    <img src="/imgs/backend-images/icon/ts.png" alt="ts"></img>
                    <div className="img-backdrop font-sansation">20%</div>
                  </div>
                  <span>Typescript</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="sql" className="gauge">
                    <img src="/imgs/backend-images/icon/sql.png" alt="sql"></img>
                    <div className="img-backdrop font-sansation">20%</div>
                  </div>
                  <span>SQL</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="cpp" className="gauge">
                    <img src="/imgs/backend-images/icon/cpp.png" alt="c++"></img>
                    <div className="img-backdrop font-sansation">10%</div>
                  </div>
                  <span>C++</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="php" className="gauge">
                    <img src="/imgs/backend-images/icon/php.png" alt="php"></img>
                    <div className="img-backdrop font-sansation">5%</div>
                  </div>
                  <span>PHP</span>
                </div>
              </div>
            </div>
            <div className="skill-list">
              <h3 className="font-roboto-mono"><b>Libraries, Tools, and Frameworks</b></h3>
              <div id="ltf" className="gauge-list">
                <div className="flex flex-col items-center">
                  <div id="react" className="gauge">
                    <img src="/imgs/backend-images/icon/react.png" alt="react"></img>
                    <div className="img-backdrop font-sansation">40%</div>
                  </div>
                  <span>React</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="next" className="gauge">
                    <img src="/imgs/backend-images/icon/next.png" alt="next.js"></img>
                    <div className="img-backdrop font-sansation">30%</div>
                  </div>
                  <span>Next.js</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="tw" className="gauge">
                    <img src="/imgs/backend-images/icon/tw.png" alt="tw"></img>
                    <div className="img-backdrop font-sansation">30%</div>
                  </div>
                  <span>Tailwind CSS</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="supabase" className="gauge">
                    <img src="/imgs/backend-images/icon/supabase.png" alt="supabase"></img>
                    <div className="img-backdrop font-sansation">20%</div>
                  </div>
                  <span>Supabase</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="git" className="gauge">
                    <img src="/imgs/backend-images/icon/git.png" alt="git"></img>
                    <div className="img-backdrop font-sansation">20%</div>
                  </div>
                  <span>Git</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="exp" className="gauge">
                    <img src="/imgs/backend-images/icon/exp.png" alt="express.js"></img>
                    <div className="img-backdrop font-sansation">20%</div>
                  </div>
                  <span>Express.js</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="firebase" className="gauge">
                    <img src="/imgs/backend-images/icon/fb.png" alt="firebase"></img>
                    <div className="img-backdrop font-sansation">20%</div>
                  </div>
                  <span>Firebase</span>
                </div>
                <div className="flex flex-col items-center">
                  <div id="node" className="gauge">
                    <img src="/imgs/backend-images/icon/node.png" alt="node.js"></img>
                    <div className="img-backdrop font-sansation">10%</div>
                  </div>
                  <span>Node.js</span>
                </div>
              </div>
            </div>
            <div className="skill-list">
              <h3 className="font-roboto-mono"><b>Technical Skills</b></h3>
              <div id="technical" className="flex flex-col">
                <div className="pc mediorce flex flex-row items-center">
                  <span className="flex items-center">Website Development</span>
                  <div className="progress-bar">
                    <div style={{ "--progress": "60%" }}></div>
                  </div>
                </div>
                <div className="pc mediorce flex flex-row items-center">
                  <span className="flex items-center">Video Editing</span>
                  <div className="progress-bar">
                    <div style={{ "--progress": "45%" }}></div>
                  </div>
                </div>
                <div className="pc beginner flex flex-row items-center">
                  <span className="flex items-center">Prompt Engineering</span>
                  <div className="progress-bar">
                    <div style={{ "--progress": "35%" }}></div>
                  </div>
                </div>
                <div className="pc beginner flex flex-row items-center">
                  <span className="flex items-center">Game Development</span>
                  <div className="progress-bar">
                    <div style={{ "--progress": "25%" }}></div>
                  </div>
                </div>
                <div className="pc beginner flex flex-row items-center">
                  <span className="flex items-center">Mobile App Development</span>
                  <div className="progress-bar">
                    <div style={{ "--progress": "10%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="skill-list">
              <h3 className="font-roboto-mono"><b>Languages</b></h3>
              <div id="languages" className="flex flex-col">
                <div className="pc flex flex-row items-center">
                  <span>Thai</span>
                  <div className="progress-bar">
                    <div style={{ "--progress": "100%" }}></div>
                    <span>Native Speaker</span>
                  </div>
                </div>
                <div className="pc flex flex-row items-center">
                  <span>English</span>
                  <div className="progress-bar">
                    <div style={{ "--progress": "70%" }}></div>
                    <span>Conversational (B1-B2)</span>
                  </div>
                </div>
                <div className="pc beginner flex flex-row items-center">
                  <span>Chinese</span>
                  <div className="progress-bar">
                    <div style={{ "--progress": "15%" }}></div>
                    <span>Beginner</span>
                  </div>
                </div>
                <div className="pc beginner flex flex-row items-center">
                  <span>German</span>
                  <div className="progress-bar">
                    <div style={{ "--progress": "5%" }}></div>
                    <span>Beginner (A1)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="skill-list">
              <h3 className="font-roboto-mono"><b>Soft Skills</b></h3>
              <ul id="soft-skills">
                <li>Problem Solving</li>
                <li>Teamwork & Leadership</li>
                <li>Responsibility</li>
              </ul>
            </div>
          </div>
        </section>
        <section id="profile">
          <h1 id="my-name" className="font-m-plus md-inf">Thanwisit Angsachon</h1>
          <div className="relative p-block" id="about-me">
            <div className="header-wrapper right flex">
              <h2 className="font-sansation">ABOUT ME</h2>
            </div>
            <p className="font-roboto-mono">A first year software engineering student from College of Art, Media and Technology at Chiang Mai University. I&apos;ve been learning programming for 3 years by myself, by working on my personal projects. I gain some experiences in Website Development, Computer Program Development, Mobile Application Development, and Game Development from them.</p>
          </div>
          <div className="p-grid">
            <div className="relative p-block" id="education">
              <div className="relative header-wrapper right flex">
                <h2 className="font-sansation">EDUCATION</h2>
              </div>
              <div className="pbc achievement-tree">
                <div className="tree">
                  <div className="circle success">✓</div>
                  <div id="to-cmu" className="line"></div>
                  <div className="circle ongoing"></div>
                </div>
                <div className="achievements">
                  <div className="achievement">
                    <h3 className="a-title font-roboto-mono">Chongfah Sinseung Wanichbamrung School</h3>
                    <div className="a-subtitle">
                      <span>High school diploma</span>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span>2022 - 2025</span>
                    </div>
                    <ul className="a-description">
                      <li>GPA: 4.00</li>
                      <li>Science & Math Plan</li>
                      <li>Graduated with honors</li>
                    </ul>
                  </div>
                  <div className="achievement ongoing">
                    <h3 className="a-title font-roboto-mono">Chiang Mai University</h3>
                    <div className="a-subtitle">
                      <span>Bachelor of Science in Software Engineering</span>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span>2025 - Present</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative p-block" id="hbs">
              <div className="relative header-wrapper right flex">
                <h2 className="font-sansation">HOBBIES</h2>
              </div>
              <p>Hobbies not only make you happy or relaxed to do it, but they can also help you improve your other skills. For example, reading in English can help me improve my English vocabulary.</p>
              <div id="hobbies" className="flex flex-col">
                <div className="hobby flex">
                  <img src="/imgs/backend-images/cv/reading.svg" alt="reading manga"></img>
                  <span>Reading</span>
                </div>
                <div className="hobby flex">
                  <img src="/imgs/backend-images/cv/headphones.svg" alt="listen to music"></img>
                  <span>Listening to Music</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative p-block" id="experiences">
            <div className="relative header-wrapper right flex">
              <h2 className="font-sansation">EXPERIENCES</h2>
            </div>
            <div className="pbc flex flex-col">
              <div className="experience">
                <h3 className="font-roboto-mono e-title">Robot Club's Booth Staff</h3>
                <h4 className="font-roboto-mono">Chongfah Sinseung Wanichbamrung School</h4>
                <div className="flex flex-row addi-details">
                  <div className="flex flex-row items-center">
                    <img src="/imgs/backend-images/cv/calendar.svg" alt="calendar"></img>
                    <span>Feb 2025</span>
                  </div>
                  <div className="flex flex-row items-center">
                    <img src="/imgs/backend-images/cv/location.svg" alt="location"></img>
                    <span>Saraphi, Chiang Mai</span>
                  </div>
                </div>
                <p>My duties were setting up the booth, monitoring overall in-booth activities, answering questions from visitors, and teaching children to play minigames in the booth.</p>
              </div>
              <div className="experience">
                <h3 className="font-roboto-mono e-title">NSC Project's Leader</h3>
                <div className="flex flex-row addi-details">
                  <div className="flex flex-row items-center">
                    <img src="/imgs/backend-images/cv/calendar.svg" alt="calendar"></img>
                    <span>Feb 2024 - July 2024</span>
                  </div>
                </div>
                <p>My responsibilities included leading a team of 3 people in the project for the NSC 2024 competition, overseeing their work, doing project report, developing the mobile application for the project, and presenting it.</p>
              </div>
              <div className="experience">
                <h3 className="font-roboto-mono e-title">YouTube Content Creator</h3>
                <h4 className="font-roboto-mono">Channel Name: CodingWithRand, 1.17k Subscribers</h4>
                <div className="flex flex-row addi-details">
                  <div className="flex flex-row items-center">
                    <img src="/imgs/backend-images/cv/calendar.svg" alt="calendar"></img>
                    <span>Nov 2021 - Aug 2023</span>
                  </div>
                </div>
                <p>My content was mostly focused on roblox game tutorials. I had editted a total of 454 videos using VSDC. Writting scripts and designing thumbnails all by myself.</p>
              </div>
            </div>
          </div>
          <div className="p-grid">
            <div className="flex flex-col w-full" id="portfolio">
              <div className="relative header-wrapper left flex">
                <h2 className="font-sansation">PORTFOLIO</h2>
              </div>
              <p className="note">*Click on the project name to view more info about the project.</p>
              <div className="flex flex-col items-center">
                <div className="project flex flex-col items-center">
                  <img src="/imgs/backend-images/coroussel/projects/wallpaper-1.png" alt="yt-converter"></img>
                  <a href="https://github.com/CodingWithRand/YouTube-Converter" target="_blank" className="font-roboto-mono text-center">YouTube Converter</a>
                  <p>A GUI-base python program that allows you to download a video/audio from the YouTube link</p>
                </div>
                <div className="project flex flex-col items-center">
                  <img src="/imgs/backend-images/coroussel/projects/wallpaper-2.png" alt="bg-remover"></img>
                  <a href="https://github.com/CodingWithRand/Background-Remover" target="_blank" className="font-roboto-mono text-center">Background Remover</a>
                  <p>A CLI-base python program that is for removing the background from an image</p>
                </div>
                <div className="project flex flex-col items-center">
                  <img src="/imgs/backend-images/coroussel/projects/wallpaper-4.png" alt="thringo"></img>
                  <a href="https://github.com/CodingWithRand/eng-game" target="_blank" className="font-roboto-mono text-center">Thringo</a>
                  <p>A language learning web application inspired from <a href="https://duolingo.com" style={{ color: "limegreen" }}>Duolingo</a></p>
                </div>
                <div className="project flex flex-col items-center">
                  <img src="/imgs/backend-images/coroussel/projects/wallpaper-6.png" alt="glam up my mark up"></img>
                  <a href="https://github.com/CodingWithRand/DEV.to-challenge" target="_blank" className="font-roboto-mon text-centero">Camp Activities Inquiry</a>
                  <p>A project submitted to participate in the first challenge of <a href="https://dev.to/devteam/join-our-first-community-challenge-the-frontend-challenge-8be" style={{ color: "red" }}><b>"The Frontend Challenge"</b></a> by <a href="https://dev.to"><b>Dev.to</b></a></p>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full" id="certificates">
              <div className="relative header-wrapper left flex">
                <h2 className="font-sansation">CERTIFICATES</h2>
              </div>
              <p className="note">*Click on the certificate name to view more info</p>
              <div className="flex flex-col items-center">
                <div className="project flex flex-col items-center">
                  <img src="/imgs/backend-images/cv/rwd_cert.png" alt="responsive web design"></img>
                  <a href="https://www.freecodecamp.org/certification/rand0mtutorial/responsive-web-design" target="_blank" className="font-roboto-mono text-center">Responsive Web Design</a>
                </div>
                <div className="project flex flex-col items-center">
                  <img src="/imgs/backend-images/cv/py_cert.png" alt="com-sci w/ python"></img>
                  <a href="https://www.freecodecamp.org/certification/rand0mtutorial/scientific-computing-with-python-v7" target="_blank" className="font-roboto-mono text-center">Scientific Computing with Python</a>
                </div>
                <div className="project flex flex-col items-center">
                  <img src="/imgs/backend-images/cv/ljs_cert.png" alt="legacy js"></img>
                  <a href="https://www.freecodecamp.org/certification/rand0mtutorial/javascript-algorithms-and-data-structures" target="_blank" className="font-roboto-mono text-center">Legacy JavaScript Algorithms and Data Structures</a>
                </div>
              </div>
            </div>
          </div>
          <p id="quote" className="text-center font-roboto-mono">
            <span className="inline-block dq-left">"</span>
            <i>Time is precious, so manage it wisely.</i>
            <span className="inline-block dq-right">"</span>
          </p>
        </section>
      </main>
    </>
    
  );
}

