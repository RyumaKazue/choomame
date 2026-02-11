import RndView from "./RndView"
import { getParam } from "../features/param/param"
import { TimesLink } from "../features/times/TimesLink"
import { LanguageLink } from "../features/languages/LanguagesLink"

export const App = () => {
    const param = getParam();
    
    return (
        <RndView>
            <TimesLink param={param}/>
            <LanguageLink param={param}/>
        </RndView>
    );
}