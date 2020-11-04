import React from "react"
import PropTypes from "prop-types"
import { LPContextProvider } from "../../contexts/LPContext"
import { PlayerContextProvider } from "../../contexts/PlayerContext"
import { UIContextProvider } from "../../contexts/UIContext"
import { LocalStorageContextProvider } from "../../contexts/LocalStorageContext"
import { TimerContextProvider } from "../../contexts/TimerContext"
import { CoinDieTokenContextProvider } from "../../contexts/CoinDieTokenContext"
import { CardSearchContextProvider } from "../../contexts/CardSearchContext"
import { MediaQueryProvider } from "../../contexts/MediaQueryContext"
import { LogContextProvider } from "../../contexts/LogContext"
import { DeckBuilderContextProvider } from "../../contexts/DeckBuilderContext"

export default function ContextProviders({ children }) {
  // yes, I know. I should have used redux. I never thought the app would
  // turn out to be this big. I did my best to optimize re-renders, though c:
  return (
    <MediaQueryProvider>
      <LocalStorageContextProvider>
        <CardSearchContextProvider>
          <UIContextProvider>
            <LogContextProvider>
              <DeckBuilderContextProvider>
                <LPContextProvider>
                  <CoinDieTokenContextProvider>
                    <PlayerContextProvider>
                      <TimerContextProvider>{children}</TimerContextProvider>
                    </PlayerContextProvider>
                  </CoinDieTokenContextProvider>
                </LPContextProvider>
              </DeckBuilderContextProvider>
            </LogContextProvider>
          </UIContextProvider>
        </CardSearchContextProvider>
      </LocalStorageContextProvider>
    </MediaQueryProvider>
  )
}

ContextProviders.propTypes = {
  children: PropTypes.node.isRequired
}
