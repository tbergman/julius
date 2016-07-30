// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/generics.js
// Purpose:                Generic React components for nCoda in general.
//
// Copyright (C) 2016 Christopher Antila
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

// NOTE: This module contains generic components, like "question box." Widely-used but specific
// components, such as the global menu bar, are stored in "ncoda.js."


import React from 'react';

import {log} from '../util/log';
import {getters} from '../nuclear/getters';
import {reactor} from '../nuclear/reactor';
import {emitters as signals} from '../nuclear/signals';


const ModalBackground = React.createClass({
    // This component is a semi-transparent background that appears behind the global menu bar, but
    // in front of everything else. Child components will, of course, be in front of the background.
    //
    // The background fills all the available screen space. Children are "flexboxxed" vertically.
    //
    propTypes: {
        children: React.PropTypes.element,
    },
    render() {
        return (
            <div className="nc-modal-background">
                {this.props.children}
            </div>
        );
    },
});


const DialogueBox = React.createClass({
    //
    //

    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {box: getters.DialogueBox};
    },
    handleClick() {
        if (this.state.box.get('callback')) {
            if ('question' === this.state.box.get('type')) {
                const answer = this.refs.answer.value;
                log.debug(`QuestionBox answered with "${answer}".`);
                this.state.box.get('callback')(answer);
            }
            else {
                this.state.box.get('callback')();
            }
        }
        signals.dialogueBoxHide();
    },
    render() {
        if (!this.state.box.get('displayed')) {
            return <div style={{display: 'none'}}/>;
        }

        let iconClass, title;

        switch (this.state.box.get('type')) {
        case 'error':
            iconClass = 'exclamation-triangle';
            title = 'Error';
            break;
        case 'warn':
            iconClass = 'exclamation-circle';
            title = 'Warning';
            break;
        case 'debug':
            iconClass = 'bug';
            title = 'Developer Message';
            break;
        case 'question':
            iconClass = 'question-circle';
            title = 'Question';
            break;
        case 'info':
        default:
            iconClass = 'info-circle';
            title = 'Information';
            break;
        }

        iconClass = `fa fa-${iconClass}`;
        const boxClass = `nc-dialogue-box nc-dialogue-${this.state.box.get('type')}`;

        let detail = '';
        if (this.state.box.get('detail')) {
            detail = <p className="nc-dialogue-detail">{this.state.box.get('detail')}</p>;
        }

        let answer;
        if ('question' === this.state.box.get('type')) {
            answer = <input type="text" ref="answer"/>;
        }

        return (
            <ModalBackground>
                <div className={boxClass}>
                    <div className="nc-dialogue-type">
                        <i className={iconClass}/><h3>{title}</h3>
                    </div>
                    <p className="nc-dialogue-msg">{this.state.box.get('message')}</p>
                    {detail}
                    {answer}
                    <button className="btn" onClick={this.handleClick}>{`OK`}</button>
                </div>
            </ModalBackground>
        );
    },
});


/** OffCanvas: A thing that glides into view.
 *
 * Props:
 * ------
 * @param {func} handleHide - This function will be called as the component wants to hide itself.
 *    The click event is given as the first argument to this function.
 * @param {bool} padding - Whether to include the "am-offcanvas-conent" <div>. Default is true.
 * @param {bool} showContents - Changing this from `false` to `true` will make the panel show up.
 * @param {str} side - Either "left" or "right" depending on which side of the parent container
 *    should hide the element. Default is "left."
 */
const OffCanvas = React.createClass({
    //
    // This component is a little weird. Because of how the CSS works, you can only see the panel
    // slide onto the canvas if the backdrop *already* has the "am-active" class. In other words,
    // if both the backdrop and the panel become "am-active" at the same time, you won't see the
    // panel slide onto the canvas. That's why we have "showPanel" and "showBackdrop" in state.
    //
    // To show the panel:
    // - parent changes "showContents" to true
    // - we set state.showBackdrop to true
    // - we set a timeout for 10ms so that...
    // - ... showMenu() sets state.showPanel to true
    //
    // To hide the panel:
    // - we set state.showPanel to false
    // - we set a timeout for 300ms (the duration of the transition) so that...
    // - ... hideBackdrop() sets state.showBackdrop to false
    // - and we call this.props.handleHide() so the parent knows we're hiding
    //
    // If the browser is doing a lot of processing, the timing might be different, but I don't think
    // users will mind missing some gliding action once in a while. To reduce the chances of this
    // failing, we set the timeout in componentDidUpdate() which is called after the component
    // ought to have rendered already.
    //
    propTypes: {
        handleHide: React.PropTypes.func.isRequired,
        padding: React.PropTypes.bool,
        showContents: React.PropTypes.bool,
        side: React.PropTypes.oneOf(['left', 'right']),
    },
    getDefaultProps() {
        return {padding: true, showContents: false, side: 'left'};
    },
    getInitialState() {
        return {showPanel: false, showBackdrop: false};
    },
    showMenu() {
        this.setState({showPanel: true});
    },
    hideBackdrop() {
        this.setState({showBackdrop: false});
    },
    componentWillReceiveProps(nextProps) {
        if ((this.props.showContents !== nextProps.showContents) &&
            nextProps.showContents) {
                this.setState({showBackdrop: true});
        }
    },
    handleHide(event) {
        this.setState({showPanel: false});
        window.setTimeout(this.hideBackdrop, 300);
        this.props.handleHide(event);
    },
    componentDidUpdate(prevProps) {
        if ((this.props.showContents !== prevProps.showContents) &&
            this.props.showContents &&
            !this.state.showPanel) {
                window.setTimeout(this.showMenu, 10);
        }
    },
    render() {
        let offCanvas = 'am-offcanvas';
        let offCanvasBar = 'am-offcanvas-bar';
        let offCanvasContent = '';

        // salient stuff
        if (this.props.side === 'right') {
            offCanvasBar += ' am-offcanvas-bar-flip';
        }
        if (this.props.padding) {
            offCanvasContent = 'am-offcanvas-content';
        }

        // deal with hiding/showing
        if (this.state.showBackdrop) {
            offCanvas += ' am-active';
        }
        if (this.state.showPanel) {
            offCanvasBar += ' am-offcanvas-bar-active';
        }

        return (
            <div className={offCanvas} onClick={this.handleHide}>
                <div className={offCanvasBar}>
                    <div className={offCanvasContent}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    },
});


export {DialogueBox, ModalBackground, OffCanvas};
