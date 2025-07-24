import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../Button";
import Image from "next/image";

// Header now requires data prop for SSR consistency
const Header = ({ handleWorkScroll, handleAboutScroll, isBlog, data }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Use only the data prop (never fallback to static import)
  const { name, showBlog, showResume, contact, socials, darkMode } = data;
  // Try to get email from contact.email, fallback to socials if not present
  let email = contact?.email;
  if (!email && Array.isArray(socials)) {
    const emailSocial = socials.find(s => s.title.toLowerCase() === 'email' && s.link.startsWith('mailto:'));
    if (emailSocial) {
      email = emailSocial.link.replace('mailto:', '').replace(/\s/g, '');
    }
  }
  if (!email) email = "hello@chetanverma.com";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Popover className="block tablet:hidden mt-5">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between p-2 laptop:p-0">
              <h1
                onClick={() => router.push("/")}
                className="font-medium p-2 laptop:p-0 link"
              >
                {name}.
              </h1>

              <div className="flex items-center bg-white bg-opacity-90 rounded shadow-md">
                {/* Only show dark/light mode button outside menu on desktop/tablet, not on mobile */}
                {/* Remove from here for mobile, keep only in menu */}
                <Popover.Button
                  className={`focus:outline-none border rounded transition-colors duration-200 ${
                    mounted && theme === "dark"
                      ? "bg-slate-800 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {mounted ? (
                    <Image
                      className="h-8 w-8"
                      src={`/images/${
                        !open
                          ? theme === "dark"
                            ? "menu-white.svg"
                            : "menu.svg"
                          : theme === "light"
                          ? "cancel.svg"
                          : "cancel-white.svg"
                      }`}
                      alt="Menu icon"
                      width={32}
                      height={32}
                      priority
                    />
                  ) : (
                    <Image
                      className="h-8 w-8"
                      src="/images/menu.svg"
                      alt="Menu icon"
                      width={32}
                      height={32}
                      priority
                    />
                  )}
                  {/* Force re-render to apply theme instantly on mobile */}
                  <span style={{ display: "none" }}>{theme}</span>
                </Popover.Button>
              </div>
            </div>
            <Popover.Panel
              className={`absolute right-0 z-10 w-11/12 p-4 ${
                theme === "dark" ? "bg-slate-800" : "bg-white"
              } shadow-md rounded-md`}
            >
              {/* Add dark/light mode button at the top of the side menu */}
              {darkMode && (
                <div className="mb-4 flex justify-end">
                  <Button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    <Image
                      className="h-6"
                      src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                      alt={theme === "dark" ? "Moon icon" : "Sun icon"}
                      width={24}
                      height={24}
                      priority
                    />
                  </Button>
                  {/* Force re-render to apply theme instantly on mobile */}
                  <span style={{ display: "none" }}>{theme}</span>
                </div>
              )}
              {!isBlog ? (
                <div className="grid grid-cols-1">
                  <Button onClick={handleWorkScroll}>Work</Button>
                  <Button onClick={handleAboutScroll}>About</Button>
                  {showBlog && (
                    <Button onClick={() => router.push("/blog")}>Blog</Button>
                  )}
                  {showResume && (
                    <Button
                      onClick={() => router.push("/resume")}
                    >
                      Resume
                    </Button>
                  )}

                  <Button onClick={() => router.push("/freelance")}>
                    Freelance
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1">
                  <Button onClick={() => router.push("/")}>Home</Button>
                  <Button onClick={() => router.push('/#work')}>Work</Button>
                  <Button onClick={() => router.push('/#about')}>About</Button>
                  {showBlog && (
                    <Button onClick={() => router.push("/blog")}>Blog</Button>
                  )}
                  {showResume && (
                    <Button
                      onClick={() => router.push("/resume")}
                      classes="first:ml-1"
                    >
                      Resume
                    </Button>
                  )}
                  <Button onClick={() => router.push("/freelance")}>Freelance</Button>
                </div>
              )}
            </Popover.Panel>
          </>
        )}
      </Popover>
      <div
        className={`mt-10 hidden flex-row items-center justify-between sticky ${
          theme === "light" && "bg-white"
        } dark:text-white top-0 z-10 tablet:flex`}
      >
        <h1
          onClick={() => router.push("/")}
          className="font-medium cursor-pointer mob:p-2 laptop:p-0"
        >
          {name}.
        </h1>
        {!isBlog ? (
          <div className="flex">
            <Button onClick={handleWorkScroll}>Work</Button>
            <Button onClick={handleAboutScroll}>About</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/resume")}
                classes="first:ml-1"
              >
                Resume
              </Button>
            )}

            <Button onClick={() => router.push("/freelance")}>
              Freelance
            </Button>
            {mounted && theme && darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Image
                  className="h-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                  alt={theme === "dark" ? "Moon icon" : "Sun icon"}
                  width={24}
                  height={24}
                  priority
                />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex">
            <Button onClick={() => router.push("/")}>Home</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/resume")}
                classes="first:ml-1"
              >
                Resume
              </Button>
            )}

            <Button onClick={() => router.push("/freelance")}>
              Freelance
            </Button>

            {mounted && theme && darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Image
                  className="h-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                  alt={theme === "dark" ? "Moon icon" : "Sun icon"}
                  width={24}
                  height={24}
                  priority
                />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
