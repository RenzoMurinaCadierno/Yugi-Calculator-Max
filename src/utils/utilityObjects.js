import React from "react"
import uiConfigs from "./ui.configs.json"
import linkedin from "../assets/expandableIcons/linkedin.svg"
import github from "../assets/expandableIcons/github.svg"
import mail from "../assets/expandableIcons/mail.svg"
import react from "../assets/expandableIcons/react.svg"
import nonYugiohAssets from "../assets/expandableIcons/nonYugiohAssets.svg"

import yugioh from "../assets/expandableIcons/yugioh.svg"

/**
 * Social Media object, configured to be displayed properly with
 * ExpandableIcon component
 */
export const socialMediaSites = {
  linkedin: {
    src: linkedin,
    alt: "Go to linkedin site",
    divContent: (toastToggler) => (
      <span role="navigation" onClick={toastToggler}>
        <u
          data-text="author's LinkedIn"
          data-url={uiConfigs.socialMediaSites.linkedin}
          style={{ cursor: "pointer" }}
        >
          View LinkedIn website
        </u>
      </span>
    )
  },
  github: {
    src: github,
    alt: "Go to Github repository",
    divContent: (toastToggler) => (
      <span role="navigation" onClick={toastToggler}>
        <u
          data-text="author's Github"
          data-url={uiConfigs.socialMediaSites.github}
          style={{ cursor: "pointer" }}
        >
          View Github repositories
        </u>
      </span>
    )
  },
  mail: {
    src: mail,
    alt: "Email address",
    divContent: (toastToggler) => "nmcadierno@gmail.com"
  }
}

/**
 * Prices and Card databases object, configured to be displayed properly
 * with ExpandableIcon component
 */
export const cardAndPricesDatabaseSites = {
  ygoProDeck: {
    name: "YGOPRODeck",
    href: "https://db.ygoprodeck.com"
  },
  ygoProDeckApiGuide: {
    name: "YGOPRODeck API",
    href: "https://db.ygoprodeck.com/api-guide"
  },
  amazon: {
    name: "Amazon",
    href: "https://amazon.com"
  },
  cardMarket: {
    name: "Cardmarket",
    href: "https://cardmarket.com"
  },
  coolStuffInc: {
    name: "CoolStuffInc",
    href: "https://coolstuffinc.com"
  },
  ebay: {
    name: "eBay",
    href: "https://ebay.com"
  },
  tcgPlayer: {
    name: "TCGPlayer",
    href: "https://tcgplayer.com"
  },
  yugiohPrices: {
    name: "Yu-Gi-Oh! Prices",
    href: "https://yugiohprices.com"
  }
}

/**
 * Acknowledged sites object, configured to be displayed properly
 * with ExpandableIcon component
 */
export const acknowledgmentsSites = {
  react: {
    src: react,
    alt: "React and React dependencies",
    divContent: (toastToggler) => (
      <div>
        <div> Libraries used in this project </div>
        <h1
          data-text="React site"
          data-url="https://reactjs.org/"
          role="navigation"
          onClick={toastToggler}
        >
          React
        </h1>
        <span> Facebook's standard React library </span>
        <h1
          data-text="Create React App"
          data-url="https://create-react-app.dev/docs/getting-started/"
          role="navigation"
          onClick={toastToggler}
        >
          Create React App
        </h1>
        <span> Widely used React app boilerplate </span>
        <h1
          data-text="React Router Dom"
          data-url="https://reactrouter.com/web/guides/quick-start/"
          role="navigation"
          onClick={toastToggler}
        >
          React Router DOM
        </h1>
        <span> Declarative routing for React.js </span>
        <h1
          data-text="React Transition Group"
          data-url="https://reactcommunity.org/react-transition-group/"
          role="navigation"
          onClick={toastToggler}
        >
          React Transition Group
        </h1>
        <span> Exposes animation transition stages by managing classes. </span>
        <h1
          data-text="React Swipeable"
          data-url="https://www.npmjs.com/package/react-swipeable/"
          role="navigation"
          onClick={toastToggler}
        >
          React Swipable
        </h1>
        <span> React swipe event handler component and hook </span>
        <h1
          data-text="Animated Number React"
          data-url="https://www.npmjs.com/package/animated-number-react/"
          onClick={toastToggler}
        >
          Animated Number React
        </h1>
        <span> A simple animated number for React using anime.js </span>
        <h1
          data-text="React Quick Pinch Zoom"
          data-url="https://www.npmjs.com/package/react-quick-pinch-zoom/"
          role="navigation"
          onClick={toastToggler}
        >
          React Quick Pinch Zoom
        </h1>
        <span>
          A "zoom and drag" elements' event handler for mobile/desktop devices{" "}
        </span>
      </div>
    ),
    onClick: null
  },
  nonYugiohAssets: {
    src: nonYugiohAssets,
    alt: "Sound effects and non-yugioh-related icons",
    divContent: (toastToggler) => (
      <div>
        <div> Non-Yu-Gi-Oh!-related assets </div>
        <h1
          data-text="IconFinder"
          data-url="https://www.iconfinder.com/"
          role="navigation"
          onClick={toastToggler}
        >
          Icon Finder
        </h1>
        <span> Icon gallery </span>
        <h1
          data-text="ZapSplat"
          data-url="https://www.zapsplat.com/"
          role="navigation"
          onClick={toastToggler}
        >
          Zap Splat
        </h1>
        <span> Free sound effects & royalty free music </span>
        <p>All assets in this app are regulated under free-to-use licenses.</p>
        <p>Nonetheless, they are up to a well deserved acknowledgment here!</p>
      </div>
    ),
    onClick: null
  },
  yugipedia: {
    src: yugioh,
    alt: "Yu-gi-oh! assets",
    divContent: (toastToggler) => (
      <div>
        <div> Yu-Gi-Oh! assets extracted from </div>
        <h1
          data-text="Yugipedia"
          data-url="https://yugipedia.com/wiki/User:Dinoguy1000/icons/"
          role="navigation"
          onClick={toastToggler}
        >
          Yugipedia
        </h1>
        <span>Free repository on every aspect of the Yu-Gi-Oh! franchise </span>
        <h1
          data-text="YGOPRODeck"
          data-url="https://ygoprodeck.com/"
          role="navigation"
          onClick={toastToggler}
        >
          YGOPRODeck
        </h1>
        <span> Yu-Gi-Oh! Database and deck share site </span>
      </div>
    ),
    onClick: null
  }
}

/**
 * Restart confirmation message object, configured to be displayed
 * properly with ExpandableIcon component
 */
export const restartConfirm = {
  message: (
    <>
      Wow! Great understanding of this coding mess. Congrats!
      <br />
      <br />
      Or if you found this by accident, congrats too!
      <br />
      <br />
      -RNMC
    </>
  )
}

/**
 * Card search and no internet connection objects. These ones are applied
 * in SecondaryScreens component, inside CardSearch
 */
export const errorMessages = {
  appNeedsInternet: (
    <>
      <div> No internet connection </div>
      <div>
        It seems that an online connection is needed to load a requested
        resource.
      </div>
      <div>Please, connect to an internet provider and reload the app.</div>
    </>
  ),
  noInternetConnection: (
    <>
      <div> No internet connection </div>
      <div>
        It seems that you have no internet connection. Thus, search attempts
        will fail.
      </div>
      <div>Please, connect to an internet provider to use the searcher.</div>
    </>
  ),
  cardSearchError: (
    <>
      <div> Search failed </div>
      <div>
        Double-check your searched term and/or your internet connection.
      </div>
      <div>
        Or YgoProDeck's database may be down. If so, please try again later.
      </div>
    </>
  ),
  genericError: (
    <>
      <h3> Generic error message </h3>
      <p>
        Hey there! If you are seeing this, then an error has been triggered
        somewhere in the app.
      </p>
      <p>
        Since this is not a case-specific kind of error *lazydevcough*, I cannot
        promise you the app will function properly.
      </p>
      <p>But alas, let me give you a couple of recommendations:</p>

      <ul>
        <li> Ol' reliable: reset the app. </li>
        <li>
          Check your internet connection and try loading the whole app (swipe
          through all pages) while online.
        </li>
        <li>
          If you are using the downloaded app version in your cellphone, try
          deleting and reinstalling it from scratch.
        </li>
        <li>If nothing works, hmm... Try playing some Pokemon TCG?</li>
      </ul>

      <p>
        Please, the developer would be glad if you keep in touch to show this
        and explain it in detail. That would certainly help tackle the issue.
      </p>
      <p>
        Or to throw all this aside and play some Pokemon. That would be a neat
        alternative.
      </p>
    </>
  )
}

/**
 * Hard-typed text for <SelectionMenuScreen />'s title and content in "CardSearch" page's
 * "Help" and "Credits" page's Secondary Screens
 */
export const secondaryScreensData = {
  searchTips: {
    displayTitle: "",
    items: {
      search: [
        'You can search for both the card\'s full name or a fragment of its name. E.g. "Dark Magician", "Magician", "Dark".',
        'If you choose to search for a part of the card\'s name, do so stating a continuous sequence of characters in its name. E.g. "ark Ma" is a valid search for "Dark Magician", where "Dark ician" is not.',
        'Watch out for special symbols, common ones are required! E.g. "Blue-Eyes" is OK, "Blue Eyes" is not.',
        'Other examples include "&". Searching for "Ash Blossom & Joyous Spring" will work, while "Ash Blossom and Joyous Spring" won\'t.',
        'When required, use hyphens "-", NOT dashes (hypens are the smaller ones). E.g. "Blue-Eyes" is valid, "Blue–Eyes" isn\'t.',
        'Searches are not case-sensitive. E.g. "Ghost Ogre", "ghost ogre" and "gHoSt OGre" are all the same.'
      ],
      prices: [
        'Prices shown in the main containers are the average (avg) ones for each set based on Yu-Gi-Oh! Prices (yugiohprices.com), and the ones shown in "Best prices" section below are the best price deals found on each stated site.',
        'Keep in mind that those "Best prices" do not discriminate between sets. As a rule of thumb, they normally correspond to the cheapest deal found on the set with the cheapest version of the searched card.',
        "If a price is not displayed (shown as -.--), it means that the target site does not have the searched card in stock. This also implies that prices shown in this app are based on the current listed cards on each site at the moment of searching.",
        "All prices -as well as cards' and sets' data- are extracted from YgoProDeck's database using its API. Full credits to them."
      ],
      filter: [
        "Filtering is available on an already searched list of cards with more than one result.",
        "Type any sequence of characters in the search box to apply filtering. Delete those to restore the results to their original state.",
        'E.g.: typing "gir" on a list containing [Dark Magician, Dark Magician Girl, Dark Magic Attack] will remove the former and the latter from it, leaving "Dark Magician Girl" as the only result.',
        'On the same fashion, removing "gir" will restore the list.',
        'To search for new results, simply type a card name or part of its name in the search box and tap on "Search".'
      ]
    }
  },
  credits: {
    acknowledgments: {
      displayTitle: "Acknowledgments",
      toggler: "acknowledgments",
      items: {
        "shout-outs": [
          "Indeed, the first shout-out goes to the whole Yu-gi-oh! community. It's given me a marvelous hobbie, awesome friends and tailwind when life looked down on me in several situations.",
          "Equally important, to my family and friends. It's more than certain than I would not be standing here if it wasn't for them. Each single step I took in life was following their advice and guided by their honest and caring intentions. I wish there were stronger words to express how much I love them all.",
          "A well deserved acknowledgment to my teachers both on Programming and Business Administration careers. I took a big chunk of what I know from them, which not only includes academic matters but life lessons.",
          "Warm congratulations to YGOPRODeck's team, specially their programmers. Its API endpoint and database are really practical and well built, it took almost no time to master them. Being free to use is an outstading gift nonetheless, so thank you lots!",
          "And finally, to you for giving this app -and by extension, myself- a chance. It was built by a fan for anyone to enjoy. I hope to accomplish that to an extent!"
        ]
      }
    },
    database: {
      displayTitle: "Card and Prices databases",
      toggler: "cardDatabases",
      items: {
        databases: [
          "Both information and prices displayed when seaching for a card are extracted from YGOPRODeck's detabase using its free API, so full credits to them for this practical endpoint, which brought a big chunk of this app up and running.",
          "This database targets the best deals for each searched card in Amazon, CardMarket, eBay, TCGPlayer and CoolStuffInc websites. Credits to them too.",
          "Visit all sites mentioned using the following links:"
        ]
      }
    },
    contact: {
      displayTitle: "License and Contact",
      toggler: "licenseContact",
      items: {
        intro: [
          "This app was developed by a fan for the whole Yu-Gi-Oh! community, in an attempt to repay everything this outstanding game has gifted me throughout the years.",
          'Needless to say, it is free to download and to use, MIT copyright license backs it up. You can find in "License" section.',
          "Feel free to use this app as you please, it is a modest present for me to you. However, if you are to develop other projects using it or its code, linking back to the author would be much appreciated. It is extremely helpful to reach recruiters on IT fields."
        ],
        author: [
          "Hey everyone! I'm Renzo Murina Cadierno, my pleasure to meet you all!",
          "I'm an enthusiastic junior programmer wannabe that specializes in Python general scripting and frontend development with Javascript. I have been learning the marvelous arts of programming for more than a year now, and let me tell you my love for it grows larger everyday.",
          "As stated in the first tab, this app is free to use. It is uploaded in my Github repository, where I keep lots of other projects that might be of your interest. Of course, feel free to go check them out!",
          "If you want to know more about myself, you can follow my LinkedIn social media platform. Everything I've done up to this point is detailed there, for both my Programming and Business Management careers.",
          "And of course, nmcadierno@gmail.com is the email address you are looking for if you want to keep in touch with me.",
          "Thank you for giving this app a go! I hope you enjoy it as much as I did while building it up."
        ],
        license: [
          "Copyright 2020 - Renzo Nahuel Murina Cadierno",
          'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:',
          "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
          'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.'
        ]
      }
    }
  }
}
