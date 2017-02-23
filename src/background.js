import {createStore} from 'redux'
import {wrapStore} from 'react-chrome-redux';
import reducers from './reducers'

function updateBadge(store) {
  const count = store.getState().configurations.filter(config => config.enabled).length;
  chrome.browserAction.setBadgeText({text: count > 0 ? count+"" : "off"});
  chrome.browserAction.setBadgeBackgroundColor({"color": count > 0 ? "#8E2800" : "#468966"});
}

(function(scope) {
    "use strict";

    const persistentStates = {configurations: []};

    chrome.storage.local.get(persistentStates, function(state) {

        var store = createStore(reducers, state);
        wrapStore(store, {portName: 'DEMO_MONKEY_STORE'}); // make sure portName matches
        updateBadge(store);

        console.log("Background Script started");

        store.subscribe(function() {
            console.log("Synchronize changes");
            chrome.storage.local.set({configurations: store.getState().configurations});
            updateBadge(store);
        });

        chrome.contextMenus.create({
            "title": "Create Replacement",
            "contexts": ["selection"],
            "onclick": function(info, tab) {
                var replacement = prompt("Replacement for \"" + info.selectionText + "\": ");
                var configs = (store.getState().configurations.filter(config => config.enabled));

                var config = configs.length > 0 ? configs[0] : store.getState().configurations[0];

                config.content += "\n" + info.selectionText + " = " + replacement;
                store.dispatch({'type': 'SAVE_CONFIGURATION', 'id': config.id, config});
            }
        });


        /* TODO: Intercept download manager to lead mnky files directly to DemoMonkey
        chrome.downloads.onCreated.addListener(function(item) {
            console.log(item);
            chrome.downloads.cancel(item.id);
        });*/
    });

})(window);