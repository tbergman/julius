// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/ncoda.js
// Purpose:                React components for nCoda in general.
//
// Copyright (C) 2015 Christopher Antila
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
// ------------------------------------------------------------------------------------------------


import React from 'react';
import {Link} from 'react-router';

import {log} from '../util/log';
import signals from '../nuclear/signals';
import {DialogueBox} from './generics';


const MainScreen = React.createClass({
    render() {
        return (
            <div id="ncoda-loading">
                <div>
                    {`Use the `}<i className="fa fa-th"></i>
                    {` button in the top-left corner to open the menu.`}
                </div>
                <MainScreenQuote/>
            </div>
        );
    },
});


const MainScreenQuote = React.createClass({
    getInitialState() {
        return {
            attribution: 'Chuck Close',
            cite: 'https://www.brainpickings.org/index.php/2012/12/27/chuck-close-on-creativity/',
            quote: 'Inspiration is for amateurs\u2014the rest of us just show up and get to work.',
        };
    },
    render() {
        return (
            <div className="nc-main-quote">
                <blockquote cite={this.state.cite}>
                    <i className="fa fa-quote-left"/>
                    <p>{this.state.quote}</p>
                    <i className="fa fa-quote-right"/>
                    <div className="attribution">{`\u2014 ${this.state.attribution}`}</div>
                </blockquote>
            </div>
        );
    },
});


const Colophon = React.createClass({
    render() {
        return (
            <div id="ncoda-colophon">
                <img src="img/nCoda-temporary_logo_square-180x180.png" alt="nCoda logo"></img>
                <div>
                    <h2>{`About nCoda`}</h2>
                    <p>{`Many people contribute to nCoda. Learn about them at URL.`}</p>
                    <p>{`You must follow the GPLv3 software license when you use nCoda. Learn about your rights and responsibilities at URL.`}</p>
                    <p>{`The nCoda source code is available at no direct cost from URL.`}</p>
                    <p>{`We use many third-party software components to build nCoda. Learn about them at URL.`}</p>
                </div>
            </div>
        );
    },
});


const GlobalHeader = React.createClass({
    // This is the header bar that should always appear at the top of the screen.
    //
    // Props:
    // - handleShowMenu (func): Called without arguments to show or hide the main menu.
    // - handleShowDevelMenu (func): Called without arguments to show or hide the developer menu.

    propTypes: {
        handleShowDevelMenu: React.PropTypes.func,
        handleShowMenu: React.PropTypes.func.isRequired,
    },
    render() {
        return (
            <div id="ncoda-global-header">
                <button onClick={this.props.handleShowMenu}>
                    <i className="fa fa-th fa-2x"></i>
                </button>
                <h1 className="ncoda-logo">
                    <div className="ncoda-logo-n">{`n`}</div>{`Coda`}
                </h1>
                <button onClick={this.props.handleShowDevelMenu}>
                    <i className="fa fa-wrench fa-2x"></i>
                </button>
            </div>
        );
    },
});


// TODO: consolidate MenuItem and GlobalMenu somehow onto an nCoda-global component
const MenuItem = React.createClass({
    propTypes: {
        // A function that closes the menu once a menu item has been chosen.
        handleCloseMenu: React.PropTypes.func,
        // The @id attribute to set on the <menuitem>
        id: React.PropTypes.string,
        // The @label and text of the <menuitem>
        label: React.PropTypes.string,
        // The URL to redirect to when this <menuitem> is selected.
        linkTo: React.PropTypes.string,
    },
    render() {
        return (
            <li id={this.props.id} onClick={this.props.handleCloseMenu}>
                <Link to={this.props.linkTo}>
                    {this.props.label}
                </Link>
            </li>
        );
    },
});


const GlobalMenu = React.createClass({
    propTypes: {
        // A function that closes the menu once a menu item has been chosen.
        handleCloseMenu: React.PropTypes.func,
        // Whether the menu is currently shown.
        showMenu: React.PropTypes.bool,
    },
    getDefaultProps() {
        return {showMenu: false};
    },
    render() {
        const globalMenuStyle = {};
        if (this.props.showMenu) {
            globalMenuStyle.display = 'block';
        }
        else {
            globalMenuStyle.display = 'none';
        }

        return (
            <nav id="ncoda-global-menu" style={globalMenuStyle}>
                <ul>
                    <MenuItem id="global-0" label="Home" linkTo="/" handleCloseMenu={this.props.handleCloseMenu}/>
                    <MenuItem id="global-1" label="Open CodeScoreView" linkTo="/codescore" handleCloseMenu={this.props.handleCloseMenu}/>
                    <MenuItem id="global-2" label="Open StructureView" linkTo="/structure" handleCloseMenu={this.props.handleCloseMenu}/>
                    <hr/>
                    <MenuItem id="global-3" label="About nCoda" linkTo="/colophon" handleCloseMenu={this.props.handleCloseMenu}/>
                </ul>
            </nav>
        );
    },
});


const DeveloperMenu = React.createClass({
    propTypes: {
        // A function that closes the menu once a menu item has been chosen.
        handleCloseMenu: React.PropTypes.func.isRequired,
        // Whether the menu is currently shown.
        showMenu: React.PropTypes.bool,
    },
    getDefaultProps() {
        return {showMenu: false};
    },
    handleClick(event) {
        // Handle a click on the menu items.

        this.props.handleCloseMenu();
        switch (event.target.id) {
        case 'devel-0':
            signals.emitters.fujianStartWS();
            break;
        case 'devel-1':
            signals.emitters.fujianRestartWS();
            break;
        case 'devel-2':
            signals.emitters.fujianStopWS();
            break;
        case 'devel-3':
            signals.emitters.setLogLevel(log.LEVELS.ERROR);
            break;
        case 'devel-4':
            signals.emitters.setLogLevel(log.LEVELS.WARN);
            break;
        case 'devel-5':
            signals.emitters.setLogLevel(log.LEVELS.INFO);
            break;
        case 'devel-6':
            signals.emitters.setLogLevel(log.LEVELS.DEBUG);
            break;
        default:
            return;
        }
    },
    render() {
        const globalMenuStyle = {};
        if (this.props.showMenu) {
            globalMenuStyle.display = 'block';
        } else {
            globalMenuStyle.display = 'none';
        }

        return (
            <nav id="ncoda-devel-menu" style={globalMenuStyle}>
                <ul>
                    <li>{`nCoda Developer Menu`}</li>
                    <hr/>
                    <h4>{`Fujian WebSocket Connection`}</h4>
                    <li id="devel-0" onClick={this.handleClick}>{`Start`}</li>
                    <li id="devel-1" onClick={this.handleClick}>{`Restart`}</li>
                    <li id="devel-2" onClick={this.handleClick}>{`Stop`}</li>
                    <hr/>
                    <h4>{`Set Log Level`}</h4>
                    <li id="devel-3" onClick={this.handleClick}>{`Error`}</li>
                    <li id="devel-4" onClick={this.handleClick}>{`Warn`}</li>
                    <li id="devel-5" onClick={this.handleClick}>{`Info`}</li>
                    <li id="devel-6" onClick={this.handleClick}>{`Debug`}</li>
                </ul>
            </nav>
        );
    },
});


const NCoda = React.createClass({
    //
    // State:
    // - menuShown (boolean): Whether the menu is shown. Obviously.
    // - develMenuShown (boolean): Whether the developer menu is shown.
    // - activeView (str): Currently active main view. Default is "default."
    //

    propTypes: {
        children: React.PropTypes.element,
    },
    getInitialState() {
        return ({menuShown: false, develMenuShown: false, activeView: 'default'});
    },
    showOrHideGlobalMenu() {
        // If the global menu is shown, hide it.
        // If the global menu is hiddent, show it.
        //
        this.setState({menuShown: !this.state.menuShown});
    },
    showOrHideDevelMenu() {
        // If the developer menu is shown, hide it.
        // If the developer menu is hidden, show it.
        //
        this.setState({develMenuShown: !this.state.develMenuShown});
    },
    render() {
        // TODO: figure out the accessibility stuff for the main menu button
        return (
            <div id="ncoda">
                <GlobalHeader handleShowMenu={this.showOrHideGlobalMenu} handleShowDevelMenu={this.showOrHideDevelMenu}/>

                <div id="ncoda-content">
                    <DialogueBox/>
                    <GlobalMenu showMenu={this.state.menuShown} handleCloseMenu={this.showOrHideGlobalMenu}/>
                    <DeveloperMenu showMenu={this.state.develMenuShown} handleCloseMenu={this.showOrHideDevelMenu}/>
                    {this.props.children}
                </div>
            </div>
        );
    },
});


export default NCoda;
export {
    Colophon,
    MainScreen,
    MenuItem,
};
