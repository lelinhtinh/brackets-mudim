/*global define, brackets, Mudim */

define(function (require) {
    'use strict';

    require('vendor/mudim-0.9-r162');

    var COMMAND_ID = 'baivong.mudim',
        COMMAND_LABEL = ['', 'VNI', 'TELEX', 'VIQR', 'MIX', 'AUTO', '---', 'OFF'],

        EDITOR_MENU = 'mudim-menu',
        EDITOR_STATUS = 'mudim-status',

        AppInit = brackets.getModule('utils/AppInit'),
        StatusBar = brackets.getModule('widgets/StatusBar'),

        PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
        prefs = PreferencesManager.getExtensionPrefs(COMMAND_ID),

        DropdownButton = brackets.getModule('widgets/DropdownButton'),
        ddMethod = new DropdownButton.DropdownButton('OFF', COMMAND_LABEL),

        Menus = brackets.getModule('command/Menus'),
        menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU),

        CommandManager = brackets.getModule('command/CommandManager'),
        mudimMenu = CommandManager.register('Bộ gõ Mudim', EDITOR_MENU, function () {
            var isActive = prefs.get('active') ? false : true;
            prefs.set('active', isActive);
            prefs.save();
        });


    prefs.definePreference('active', 'boolean', false);
    prefs.definePreference('method', 'number', 5);

    menu.addMenuDivider();
    menu.addMenuItem(EDITOR_MENU);

    StatusBar.addIndicator(EDITOR_STATUS, ddMethod.$button, true, 'btn btn-dropdown btn-status-bar', 'Chọn kiểu gõ Tiếng Việt', 'status-overwrite');

    ddMethod.on('select', function (event, item, itemIndex) {
        if (itemIndex === 7) { // OFF
            prefs.set('active', false);
        } else {
            prefs.set('active', true);
            prefs.set('method', itemIndex);
        }
        prefs.save();
    });

    prefs.on('change', function () {
        var isActive = prefs.get('active'),
            currentMethod = prefs.get('method');

        mudimMenu.setChecked(isActive);
        if (isActive) {
            ddMethod.$button.text(COMMAND_LABEL[currentMethod]);
        } else {
            ddMethod.$button.text(COMMAND_LABEL[7]);
        }

        if (currentMethod < 1 || currentMethod > 5 || !isActive) currentMethod = 0;
        Mudim.SetMethod(currentMethod);
    });

    AppInit.appReady(function () {
        Mudim.BeforeInit = function () {
            Mudim.IGNORE_ID = ['email', 'url'];
        };
        Mudim.AfterInit = function () {
            Mudim.HidePanel();
        };
        prefs.trigger('change');
    });

});
