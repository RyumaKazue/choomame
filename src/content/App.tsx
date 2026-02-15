import RndView from "./RndView"
import { getParam } from "../features/param/param"
import { TimesLink } from "../features/times/TimesLink"
import { LanguageLink } from "../features/languages/LanguagesLink"
import { CustomLinkItemLink } from "../features/customLink/CustomLinkItemLink"

export const App = () => {
    const param = getParam();
    
    return (
        <RndView>
            <TimesLink param={param}/>
            <LanguageLink param={param}/>
            <CustomLinkItemLink paramQuery={param.q}/>
        </RndView>
    );
}