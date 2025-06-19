import { NextPrevButton } from '@components/music-player/next-prev-button'
import { useMusicPlayerStore } from '@store/music-player-store'
import { Menu } from '@vidstack/react'
import { DefaultVideoLayout } from '@vidstack/react/player/layouts/default'
import type { AnimeSongWithImage } from 'types'
import { customIcons } from './custom-icons'

export const CustomLayout = () => {
  const { variants, src, setSrc, type } = useMusicPlayerStore()

  const handleQualityChange = (variant: AnimeSongWithImage) => {
    if (src === (variant.audio_url || variant.video_url)) return
    if (type === 'audio') {
      setSrc(variant.audio_url)
    }
    if (type === 'video') {
      setSrc(variant.video_url)
    }
  }
  return (
    <DefaultVideoLayout
      icons={customIcons}
      slots={{
        beforePlayButton: <NextPrevButton direction="Prev" />,
        afterPlayButton: <NextPrevButton direction="Next" />,
        pipButton: <></>,
        settingsMenuItemsStart: (
          <Menu.Root className="vds-menu relative ">
            <Menu.Button
              className={`${type === 'audio' ? 'hidden' : 'vds-menu-item '} `}
              aria-label="quality"
            >
              <svg
                viewBox="0 0 32 32"
                className="vds-menu-close-icon vds-icon"
                fill="none"
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.0908 14.3334C12.972 14.3334 12.9125 14.1898 12.9965 14.1058L17.7021 9.40022C17.9625 9.13987 17.9625 8.71776 17.7021 8.45741L16.2879 7.04319C16.0275 6.78284 15.6054 6.78284 15.3451 7.04319L6.8598 15.5285C6.59945 15.7888 6.59945 16.2109 6.8598 16.4713L8.27401 17.8855L8.27536 17.8868L15.3453 24.9568C15.6057 25.2172 16.0278 25.2172 16.2881 24.9568L17.7024 23.5426C17.9627 23.2822 17.9627 22.8601 17.7024 22.5998L12.9969 17.8944C12.9129 17.8104 12.9724 17.6668 13.0912 17.6668L26 17.6668C26.3682 17.6668 26.6667 17.3683 26.6667 17.0001V15.0001C26.6667 14.6319 26.3682 14.3334 26 14.3334L13.0908 14.3334Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="vds-menu-item-icon vds-icon"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M7 9v2a1 1 0 0 0 1 1h1M10 9v6M14 9v6M17 9l-2 3 2 3M15 12h-1" />
              </svg>
              <span>Quality</span>

              <svg
                viewBox="0 0 32 32"
                className="vds-menu-open-icon vds-icon"
                fill="none"
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.947 16.095C17.999 16.043 17.999 15.9585 17.947 15.9065L11.6295 9.58899C11.3691 9.32864 11.3691 8.90653 11.6295 8.64618L13.2323 7.04341C13.4926 6.78306 13.9147 6.78306 14.1751 7.04341L21.0289 13.8973C21.0392 13.9064 21.0493 13.9158 21.0591 13.9257L22.6619 15.5285C22.9223 15.7888 22.9223 16.2109 22.6619 16.4713L14.1766 24.9565C13.9163 25.2169 13.4942 25.2169 13.2338 24.9565L11.631 23.3538C11.3707 23.0934 11.3707 22.6713 11.631 22.411L17.947 16.095Z"
                  fill="currentColor"
                ></path>
              </svg>
            </Menu.Button>
            <div className="vds-menu-items relative">
              <Menu.Items className="vds-menu-items">
                {variants.map((variant) => (
                  <button
                    onClick={() => handleQualityChange(variant)}
                    key={variant.song_id}
                    className={`hover:bg-Complementary flex max-h-10 w-full cursor-pointer gap-4 p-2 transition-colors duration-300 ${(variant.video_url || variant.audio_url) === src ? 'text-enfasisColor' : 'text-Primary-50'}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-6 w-6"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <path d="M7 9v2a1 1 0 0 0 1 1h1M10 9v6M14 9v6M17 9l-2 3 2 3M15 12h-1" />
                    </svg>

                    {variant.resolution}
                  </button>
                ))}
              </Menu.Items>
            </div>
          </Menu.Root>
        ),
      }}
    ></DefaultVideoLayout>
  )
}
