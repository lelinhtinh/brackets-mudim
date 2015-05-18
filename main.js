/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, Mudim */

define(function (require, exports, module) {
    "use strict";

    var Menus = brackets.getModule("command/Menus"),
        AppInit = brackets.getModule("utils/AppInit"),
        CommandManager = brackets.getModule("command/CommandManager"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager");

    var COMMAND_ID = "baivong.mudim",
        COMMAND_MUDIM_ON = COMMAND_ID + ".on",
        mudimPreferences = PreferencesManager.getExtensionPrefs(COMMAND_ID);

    var mudimOn = mudimPreferences.get("on"),
        mudimMethod = mudimPreferences.get("method");

    require("mudim");

    if (mudimOn === undefined) {
        mudimOn = true;
    }

    if (mudimMethod === undefined) {
        mudimPreferences.set("method", 5);
    }

    var mudimMenu = CommandManager.register("Bộ gõ Mudim", COMMAND_MUDIM_ON, function () {
        if (mudimPreferences.get("on")) {
            mudimOn = false;
            Mudim.SetMethod(0);
        } else {
            mudimOn = true;
            Mudim.SetMethod(mudimPreferences.get("method"));
        }
        mudimMenu.setChecked(mudimOn);
        mudimPreferences.set("on", mudimOn);
    });

    if (mudimOn) {
        mudimMenu.setChecked(true);
        mudimPreferences.set("on", true);
    }

    AppInit.appReady(function () {

        Mudim.BeforeInit = function () {
            Mudim.IGNORE_ID = ["email", "url"];
        };
        Mudim.AfterInit = function () {
            if (mudimPreferences.get("on")) {
                Mudim.SetMethod(mudimPreferences.get("method"));
            } else {
                Mudim.SetMethod(0);
            }
            Mudim.HidePanel();
        };
    });

    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(COMMAND_MUDIM_ON);

});
