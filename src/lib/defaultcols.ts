export function getDefaultColumns() {
    return [
        {
            id: 'SOCIAL',
            text: 'Social',
            icon: 'fa-solid fa-envelope',
            color: '#e67e80',
            items: [
                {
                    id: '1',
                    text: 'Gmail',
                    icon: 'fa-solid fa-envelope',
                    url: 'https://mail.google.com/mail/u/0/#inbox'
                },
                {
                    id: '2',
                    text: 'Twitter',
                    icon: 'fa-brands fa-twitter',
                    url: 'https://www.twitter.com/'
                },
                {
                    id: '3',
                    text: 'Discord',
                    icon: 'fa-brands fa-discord',
                    url: 'https://discord.com/login'
                },
                {
                    id: '4',
                    text: 'Reddit',
                    icon: 'fa-brands fa-reddit',
                    url: 'https://www.reddit.com/'
                }
            ]
        },
        {
            id: 'CODE',
            text: 'Code',
            icon: 'fa-solid fa-terminal',
            color: '#a7c080',
            items: [
                {
                    id: '5',
                    text: 'GitHub',
                    icon: 'fa-brands fa-github',
                    url: 'https://github.com/login'
                },
                {
                    id: '6',
                    text: 'Codewars',
                    icon: 'fa-solid fa-fan',
                    url: 'https://www.codewars.com/dashboard'
                },
                {
                    id: '7',
                    text: 'Hacker News',
                    icon: 'fa-brands fa-square-hacker-news',
                    url: 'https://news.ycombinator.com/'
                },
                {
                    id: '8',
                    text: 'Flathub',
                    icon: 'fa-solid fa-flask',
                    url: 'https://flathub.org/'
                }
            ]
        },
        {
            id: 'CLASS',
            text: 'Class',
            icon: 'fa-solid fa-book',
            color: '#dbbc7f',
            items: [
                {
                    id: '9',
                    text: 'Calendar',
                    icon: 'fa-solid fa-calendar',
                    url: 'https://calendar.google.com/calendar/u/0/r?pli=1'
                },
                {
                    id: '10',
                    text: 'Drive',
                    icon: 'fa-brands fa-google-drive',
                    url: 'https://drive.google.com/drive/u/0/my-drive'
                },
                {
                    id: '11',
                    text: 'Excalidraw',
                    icon: 'fa-solid fa-pencil',
                    url: 'https://excalidraw.com/'
                },
                {
                    id: '12',
                    text: 'Canvas',
                    icon: 'fa-solid fa-chalkboard',
                    url: ''
                }
            ]
        },
        {
            id: 'MEDIA',
            text: 'Media',
            icon: 'fa-solid fa-clapperboard',
            color: '#7fbbb3',
            items: [
                {
                    id: '13',
                    text: 'Youtube',
                    icon: 'fa-brands fa-youtube',
                    url: 'https://www.youtube.com/'
                },
                {
                    id: '14',
                    text: 'Twitch',
                    icon: 'fa-brands fa-twitch',
                    url: 'https://www.twitch.tv/'
                },
                {
                    id: '15',
                    text: 'Spotify',
                    icon: 'fa-brands fa-spotify',
                    url: 'https://open.spotify.com'
                },
                {
                    id: '16',
                    text: 'Aniwatch',
                    icon: 'fa-solid fa-file-video',
                    url: 'https://aniwatch.to'
                }
            ]
        },
        {
            id: 'UTILITY',
            text: 'Utility',
            icon: 'fa-solid fa-gear',
            color: '#d699b6',
            items: [
                {
                    id: '17',
                    text: 'ChatGPT',
                    icon: 'fa-solid fa-robot',
                    url: 'https://chat.openai.com/'
                },
                {
                    id: '18',
                    text: 'Cobalt',
                    icon: 'fa-solid fa-wrench',
                    url: 'https://cobalt.tools/'
                },
                {
                    id: '19',
                    text: 'Home',
                    icon: 'fa-solid fa-home',
                    url: ''
                },
                {
                    id: '20',
                    text: 'Portainer',
                    icon: 'fa-solid fa-server',
                    url: ''
                }
            ]
        },
        {
            id: 'MUSIC',
            text: 'Music',
            icon: 'fa-solid fa-music',
            color: '#83c092',
            items: [
                {
                    id: '21',
                    text: 'Soundcloud',
                    icon: 'fa-brands fa-soundcloud',
                    url: 'https://soundcloud.com/'
                },
                {
                    id: '22',
                    text: 'Apple Music',
                    icon: 'fa-brands fa-apple',
                    url: 'https://www.music.apple.com/'
                },
                {
                    id: '23',
                    text: 'Youtube Music',
                    icon: 'fa-brands fa-youtube',
                    url: 'https://www.music.youtube.com/'
                },
                {
                    id: '24',
                    text: 'Last.fm',
                    icon: 'fa-brands fa-lastfm',
                    url: 'https://www.last.fm/user/'
                }
            ]
        }
    ];
}
