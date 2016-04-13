// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/score_view.js
// Purpose:                React components for ScoreView module.
//
// Copyright (C) 2016 Andrew Horwitz, Sienna M. Wood
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

import Scroll from './scroll';

export const OldScoreView = React.createClass({
    //
    // State
    // =====
    // - meiForVerovio
    // - renderedMei
    // - verovio
    //
    propTypes: {
        meiForVerovio: React.PropTypes.string.isRequired,
        registerOutboundFormat: React.PropTypes.func.isRequired,
        unregisterOutboundFormat: React.PropTypes.func.isRequired
    },
    getInitialState() {
        // - verovio: the instance of Verovio Toolkit
        // - renderedMei: the current SVG score as a string
        // - meiForVerovio: do NOT set in this function (set in code_score_view.js)
        return {
            verovio: null, 
            renderedMei: ''
        };
    },
    renderWithVerovio(renderThis) {
        // Ensure there's an instance of Verovio available, and use it to render "renderThis."
        //
        // TODO: move all the interaction with Verovio to part of the model
        //

        if (null === this.state.verovio) {
            return (
                <div class="verovio-waiting">
                    <i class="fa fa-spinner fa-5x fa-spin"></i>
                    <div>{'Loading ScoreView'}</div>
                </div>
            );
        }
        else if (null === renderThis) {
            return 'Received no MEI to render.';
        }

        let theOptions = {inputFormat: 'mei'};
        theOptions = JSON.stringify(theOptions);
        let rendered = this.state.verovio.renderData(renderThis, theOptions);
        // TODO: dynamically set the height of the .ncoda-verovio <div> so it automatically responds proportionally to width changes
        rendered = rendered.replace('width="2100px" height="2970px"', '');
        return rendered;
    },
    makeVerovio() {
        // TODO: consider whether we should be making a global instance? (I'm thinking one per Verovio component is good though)

        try {
            this.setState({verovio: new verovio.toolkit()});
        }
        catch (err) {
            if ('ReferenceError' === err.name) {
                window.setTimeout(this.makeVerovio, 250);
            }
            else {
                throw err;
            }
        }
    },
    componentWillMount() {
        this.makeVerovio();
        this.props.registerOutboundFormat('verovio', 'Verovio component', true);
    },
    componentWillUnmount() {
        this.props.unregisterOutboundFormat('verovio', 'Verovio component');
        delete this.state.verovio;
    },
    render() {
        const innerHtml = {__html: this.renderWithVerovio(this.state.meiForVerovio)};
        return (
            <Scroll>
                <div className="ncoda-verovio" ref="verovioFrame" dangerouslySetInnerHTML={innerHtml}></div>
            </Scroll>
        );
    },
});

/** ScoreView: a React container for Vida6.
 *
 * Props:
 * ------
 * @param {str} sectId: The @xml:id attribute of the <section> to display.
 *
 * NOTE: this component does not update in the usual React way because it is a React wrapper around
 *       Vida6. The data rendered by Vida6 is managed in js/nuclear/stores/verovio.js
 */

export const ScoreView = React.createClass({
    propTypes: {
        sectId: React.PropTypes.string.isRequired,
        lyGetSectionById: React.PropTypes.func.isRequired,
        meiForVerovio: React.PropTypes.object.isRequired,
        registerOutboundFormat: React.PropTypes.func.isRequired,
        unregisterOutboundFormat: React.PropTypes.func.isRequired,
        addNewVidaView: React.PropTypes.func.isRequired,
        destroyVidaView: React.PropTypes.func.isRequired
    },
    getDataBindings() {
        return {
            sectId: this.props.sectId,
            meiForVerovio: this.props.meiForVerovio
        };
    },
    componentWillMount() {
        this.props.registerOutboundFormat('verovio', 'Verovio component');
        this.props.lyGetSectionById(this.props.sectId);
    },
    componentDidMount() { // Create the vidaView
        this.props.addNewVidaView(this.refs.verovioFrame, this.props.sectId);
    },
    componentWillReceiveProps(nextProps) {
        if (this.props.sectId !== nextProps.sectId) {
            this.props.destroyVidaView(this.props.sectId);
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        // if the sectIds don't line up, we want to re-render
        if (this.props.sectId !== nextProps.sectId) {
            return true;
        }
        return false;
    },
    componentDidUpdate() { // Create the vidaView
        this.props.addNewVidaView(this.refs.verovioFrame, this.props.sectId);
    },
    componentWillUnmount() {
        this.props.unregisterOutboundFormat('verovio', 'Verovio component');
        this.props.destroyVidaView(this.props.sectId);
    },
    render() {
        return (
            <Scroll>
                <div className="ncoda-verovio" ref="verovioFrame"></div>
            </Scroll>
        );
    },
});
