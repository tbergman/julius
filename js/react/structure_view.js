// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/structure_view.js
// Purpose:                React components for StructureView.
//
// Copyright (C) 2015, 2016 Christopher Antila
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

import {Button, Icon, Image, List, ListItem} from 'amazeui-react';
import {Immutable} from 'nuclear-js';
import React from 'react';

import getters from '../nuclear/getters';
import log from '../util/log';
import reactor from '../nuclear/reactor';
import signals from '../nuclear/signals';

import {MenuItem} from './ncoda';


/** HeaderField: Subcomponent of HeaderList, a single MEI header.
 *
 * @param {string} name - The header's display name.
 * @param {string} value - The header's value.
 */
const HeaderField = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        value: React.PropTypes.string,
    },
    getDefaultProps() {
        return {name: '', value: ''};
    },
    handleEdit() {
        signals.emitters.dialogueBoxShow({
            type: 'question',
            message: 'Please enter a new value for the field',
            callback: (value) => signals.emitters.changeHeader(this.props.name, value),
        });
    },
    handleDelete(event) {
        event.stopPropagation();
        signals.emitters.removeHeader(this.props.name);
    },
    render() {
        const display = `${this.props.name}: ${this.props.value}`;
        return (
            <ListItem>
                <Button onClick={this.handleDelete} amStyle="danger" className="header-button">
                    <Icon icon="minus-circle"/>
                </Button>
                <Button onClick={this.handleEdit} amStyle="warning" className="header-button">
                    <Icon icon="pencil"/>
                </Button>
                {display}
            </ListItem>
        );
    },
});


/** HeaderList: Subcomponent of HeaderBar, the actual list of headers.
 *
 * State
 * -----
 * @param {ImmutableJS.Map} headers - The "flat" list of MEI headers.
 */
const HeaderList = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {headers: getters.headersFlat};
    },
    handleAddHeader() {
        log.error('Adding a header is not implemented yet.');
    },
    render() {
        return (
            <List id="headerbar-list">
                {this.state.headers.map((value, name) =>
                    <HeaderField key={name} name={name} value={value}/>
                ).toArray()}
                <ListItem>
                    <Button onClick={this.handleAddHeader} amStyle="success">
                        <Icon icon="plus-circle"/>
                    </Button>
                </ListItem>
            </List>
        );
    },
});


/** HeaderBar: In the top-left corner, this shows a list of the MEI headers.
 *
 * State
 * -----
 * @param {bool} showHeaderList - Whether the list of headers is expanded.
 */
const HeaderBar = React.createClass({
    getInitialState() {
        return {showHeaderList: false};
    },
    showOrHide() {
        this.setState({showHeaderList: !this.state.showHeaderList});
    },
    render() {
        let headerList;
        if (this.state.showHeaderList) {
            headerList = <HeaderList/>;
        }

        return (
            <div className="nc-strv-menu nc-strv-menu-tl" id="nc-strv-header-bar">
                <div className="header">
                    {`Header Bar`}
                    <ShowOrHideButton
                        func={this.showOrHide}
                        expands="down"
                        isShown={this.state.showHeaderList}
                    />
                </div>
                {headerList}
            </div>
        );
    },
});


const ExpandedSectionViewGraph = React.createClass({
    render() {
        return (
            <div id="ncoda-expanded-section-svg">
                <h2>{`A`}</h2>
                <img src="structureview_mock/expanded_section_view.svg"></img>
            </div>
        );
    },
});


const ExpandedSectionView = React.createClass({
    // ExpandedSectionView
    //
    // State
    // - showGraph: whether the SVG graph is visible (true) or invisible (false)
    //

    getInitialState() {
        return {showGraph: false};
    },
    showOrHide() {
        this.setState({showGraph: !this.state.showGraph});
    },
    render() {
        let graph = '';
        if (this.state.showGraph) {
            graph = <ExpandedSectionViewGraph/>;
        }

        return (
            <div className="nc-strv-menu nc-strv-menu-tr" id="nc-strv-expanded-section">
                <div className="header">
                    <ShowOrHideButton func={this.showOrHide} expands="down" isShown={this.state.showGraph}/>
                    {`Expanded Section View`}
                </div>
                {graph}
            </div>
        );
    },
});


const ShowOrHideButton = React.createClass({
    // ShowOrHideButton
    //
    // Render a button to show or hide another component. This component does not do the showing or
    // hiding itself, but rather calls a no-argument function to do that.
    //
    // Props:
    // - func (function) This function is called without arguments when the button is clicked.
    // - isShown (boolean) Whether the component shown/hidden by this button is currently shown.
    // - expands (string) Either 'up,' 'down', 'left', or 'right', depending on the direction the
    //     shown/hidden component moves when it expands.
    //

    propTypes: {
        expands: React.PropTypes.oneOf(['up', 'down', 'left', 'right', 'expand']),
        func: React.PropTypes.func.isRequired,
        isShown: React.PropTypes.bool,
    },
    getDefaultProps() {
        return {expands: 'expand'};
    },
    handleClick() {
        this.props.func();
    },
    render() {
        let className = '';

        if ('expand' === this.props.expands) {
            className = 'fa-expand';
        }
        else if (false === this.props.isShown) {
            // the chevron points in the direction of this.props.expands
            className = `fa-chevron-${this.props.expands}`;
        }
        else if (true === this.props.isShown) {
            // the chevron points opposite the direction of this.props.expands
            switch (this.props.expands) {
            case 'down':
                className = 'fa-chevron-up';
                break;
            case 'left':
                className = 'fa-chevron-right';
                break;
            case 'right':
                className = 'fa-chevron-left';
                break;
            case 'up':
            default:
                className = 'fa-chevron-down';
            }
        }
        else {
            className = 'fa-expand';
        }

        className = `fa ${className}`;

        return (
            <button name="show-or-hide-button" className="show-or-hide-button" type="button" onClick={this.handleClick}>
                <i className={className}></i>
            </button>
        );
    },
});


const SectionContextMenu = React.createClass({
    // This menu appears when users click on a Section component.
    //

    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {style: getters.sectionContextMenu};
    },
    closeMenu() {
        // Handle a click on the menu items.
        signals.emitters.sectionContextMenu({show: false});
    },
    render() {
        return (
            <nav id="ncoda-section-menu" style={this.state.style.toObject()}>
                <ul>
                    <MenuItem id="ncoda-section-menu-1" label="Open CodeScoreView" linkTo="/structure" closeThatMenu={this.closeMenu}/>
                    <MenuItem id="ncoda-section-menu-2" label="View Version History" linkTo="/structure" closeThatMenu={this.closeMenu}/>
                    <MenuItem id="ncoda-section-menu-3" label="Download Source File" linkTo="/structure" closeThatMenu={this.closeMenu}/>
                </ul>
            </nav>
        );
    },
});


const ContextMenus = React.createClass({
    render() {
        return <div><SectionContextMenu/></div>;
    },
});


/** StaffGroupOrStaff: Subcomponent of PartsList, which renders the data for a part or group of them.
 *
 * This component calls itself recursively to deal with nested <staffGroup> elements
 *
 * Props
 * -----
 * @param {ImmutableJS.List or ImmutableJS.Map} names - Names of the staves to show.
 */
const StaffGroupOrStaff = React.createClass({
    propTypes: {
        names: React.PropTypes.oneOfType([
            React.PropTypes.instanceOf(Immutable.Map),
            React.PropTypes.instanceOf(Immutable.List),
        ]).isRequired,
    },
    render() {
        if (Immutable.Map.isMap(this.props.names)) {
            return (
                <ListItem>{this.props.names.get('label')}</ListItem>
            );
        }

        return (
            <ListItem>
                <List>
                    {this.props.names.map((names, index) =>
                        <StaffGroupOrStaff key={index} names={names}/>
                    )}
                </List>
            </ListItem>
        );
    },
});


/** PartsList: Subcomponent of PartsList, the actual content.
 *
 * State
 * -----
 * @param {ImmutableJS.List} sections - Data about <section> elements in the score, provided by
 *     Lychee's "document-outbound" converter.
 */
const PartsList = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {sections: getters.sections};
    },
    render() {
        // TODO: find a better solution to which staves to display... Julius issue #14.
        const scoreOrder = this.state.sections.get('score_order').get(0);
        const partsList = this.state.sections.get(scoreOrder).get('staffGrp');
        return (
            <List>
                {partsList.map((parts, index) =>
                    <StaffGroupOrStaff key={index} names={parts}/>
                )}
            </List>
        );
    },
});


/** StavesStructure: In the bottom-left corner, this shows the staves in the score/section.
 *
 * State
 * -----
 * @param {boolean} showParts - Whether the contents are currently displayed.
 */
const StavesStructure = React.createClass({
    getInitialState() {
        return {showParts: false};
    },
    showOrHide() {
        this.setState({showParts: !this.state.showParts});
    },
    render() {
        let partsList;
        if (this.state.showParts) {
            partsList = <PartsList/>;
        }

        return (
            <div className="nc-strv-menu nc-strv-menu-bl" id="nc-strv-staves">
                <div className="header">
                    {`Staves Structure`}
                    <ShowOrHideButton func={this.showOrHide} expands="up" isShown={this.state.showParts}/>
                </div>
                {partsList}
            </div>
        );
    },
});


const Changeset = React.createClass({
    // Information about a changeset.
    //
    // Props:
    // - date (string): The date of the changeset, YYYY-MM-DD.
    // - message (string): The message associated with the changeset.
    //

    propTypes: {
        date: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired,
    },
    render() {
        let message = this.props.message;
        if (message.indexOf('\n') > -1) {
            message = message.slice(0, message.indexOf('\n'));
        }

        return (
            <li><time dateTime={this.props.date}>{this.props.date}</time>{`: ${message}`}</li>
        );
    },
});


const Collaborator = React.createClass({
    // Information about a collaborator and their recent changesets.
    //
    // Props:
    // - name (string): The collaborator's name, whether a username, their real name, or other.
    // - changesets (List of string): An ImmutableJS.List of the IDs of this person's hangesets.
    // - numToShow (integer): The maximum number of changesets to show for this user.
    //

    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {revlog: getters.vcsChangesets};
    },
    propTypes: {
        changesets: React.PropTypes.instanceOf(Immutable.List).isRequired,
        name: React.PropTypes.string.isRequired,
        numToShow: React.PropTypes.number,
    },
    getDefaultProps() {
        return {numToShow: 3};
    },
    render() {
        // NOTE: in this function, "this.state.revlog" is all the changesets in the repository, and
        //       "this.props.changesets" is the changeset IDs of this user

        let hashes = this.props.changesets;
        if (hashes.size > this.props.numToShow) {
            hashes = hashes.slice(-1 * this.props.numToShow);
        }

        const changesets = [];
        for (const hash of hashes) {
            const theDate = new Date();
            theDate.setTime(1000 * this.state.revlog.get(hash).get('date'));
            changesets.push(
                <Changeset
                    key={hash}
                    date={theDate.toDateString()}
                    message={this.state.revlog.get(hash).get('description')}
                />
            );
        }

        return (
            <li>
                <address>{this.props.name}</address>
                <ul>
                    {changesets}
                </ul>
            </li>
        );
    },
});


const CollaboratorList = React.createClass({
    //

    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {users: getters.vcsUsers};
    },
    render() {
        const collaborators = [];
        for (const person of this.state.users.values()) {
            // TODO: implement numToShow, which ought to lety based on the number of users
            collaborators.push(
                <Collaborator
                    key={person.hashCode()}
                    name={person.get('name')}
                    changesets={person.get('changesets')}
                />
            );
        }

        return (
            <ul>
                {collaborators}
            </ul>
        );
    },
});


const Collaboration = React.createClass({
    // Collaboration
    //
    // State
    // - showCollaborators: whether the list of collaborators is visible (true) or invisible (false)
    //

    getInitialState() {
        return {showCollaborators: false};
    },
    showOrHide() {
        this.setState({showCollaborators: !this.state.showCollaborators});
    },
    render() {
        let collabList = '';
        if (this.state.showCollaborators) {
            collabList = <CollaboratorList/>;
        }

        return (
            <div className="nc-strv-menu nc-strv-menu-br" id="nc-strv-collaboration">
                <div className="header">
                    <ShowOrHideButton func={this.showOrHide} expands="up" isShown={this.state.showCollaborators}/>
                    {`Collaborators`}
                </div>
                {collabList}
            </div>
        );
    },
});


const Section = React.createClass({
    propTypes: {
        colour: React.PropTypes.string,
        id: React.PropTypes.string.isRequired,
        lastUpdated: React.PropTypes.shape({
            name: React.PropTypes.string,
            date: React.PropTypes.instanceOf(Date),
        }),
        name: React.PropTypes.string.isRequired,
        pathToImage: React.PropTypes.string,
    },
    handleClick(event) {
        // Set the NuclearJS state required to show the context menu.
        const style = {show: true};
        style.left = `${event.clientX}px`;
        style.top = `${event.clientY}px`;
        signals.emitters.sectionContextMenu(style);
    },
    render() {
        let headerStyleAttr = {};
        if (this.props.colour) {
            headerStyleAttr = {background: this.props.colour};
        }

        let image;
        if (this.props.pathToImage) {
            image = <Image alt="" src={this.props.pathToImage}/>;
        }
        else {
            image = <Icon icon="music" button amStyle="primary" className="am-center"/>;
        }

        let lastModified;
        if (this.props.lastUpdated) {
            lastModified = (
                <footer>
                    <address>{this.props.lastUpdated.name}</address>
                    <time dateTime={this.props.lastUpdated.date.toISOString()}>
                        {this.props.lastUpdated.date.toDateString()}
                    </time>
                </footer>
            );
        }

        return (
            <section className="nc-strv-section" id={`section-${this.props.id}`} onClick={this.handleClick}>
                <header>
                    {this.props.name}
                    <div className="ncoda-section-colour" style={headerStyleAttr}></div>
                </header>
                <div className="nc-strv-section-img">
                    {image}
                </div>
                {lastModified}
            </section>
        );
    },
});


const ActiveSections = React.createClass({
    propTypes: {
        // A function that, when called with no argument, opens the SectionContextMenu in the right place.
        openContextMenu: React.PropTypes.func.isRequired,
    },
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {changesets: getters.vcsChangesets, sections: getters.sections};
    },
    handleClick() { this.props.openContextMenu(); },  // TODO: deduplicate with handleClick() in <Section>
    render() {
        const order = this.state.sections.get('score_order');
        let sections;
        if (order) {
            sections = order.map((sectId, i) => {
                const lastHash = this.state.sections.getIn([sectId, 'last_changeset']);
                let lastUpdated;
                if (this.state.changesets.has(lastHash)) {
                    let name = this.state.changesets.getIn([lastHash, 'user']);
                    name = name.slice(0, name.indexOf(' <'));  // TODO: this is not foolproof

                    let date = new Date();
                    date.setTime(this.state.changesets.getIn([lastHash, 'date']) * 1000);

                    lastUpdated = {
                        name: name,
                        date: date,
                    };
                }
                return (
                    <Section
                        key={i}
                        id={sectId}
                        name={this.state.sections.getIn([sectId, 'label'])}
                        lastUpdated={lastUpdated}

                        onClick={this.handleClick}
                    />
                );
            });
        }
        else {
            sections = <Icon icon="circle-o-notch" spin amSize="lg" className="am-text-primary"/>;
        }

        return (
            <article className="nc-active-sections">
                <header>
                    {`Active Score`}
                </header>
                <div>
                    {sections}
                </div>
            </article>
        );
    },
});


const StructureView = React.createClass({
    showSectionContextMenu(event) {
        // Display the context menu under the cursor.
        const menu = document.getElementById('ncoda-section-menu');
        menu.style.left = `${event.clientX}px`;
        menu.style.top = `${event.clientY}px`;
        menu.style.display = 'flex';
    },
    componentWillMount() {
        signals.emitters.registerOutboundFormat('vcs', 'StructureView', true);
        signals.emitters.registerOutboundFormat('document', 'StructureView', true);
    },
    componentWillUnmount() {
        signals.emitters.unregisterOutboundFormat('vcs', 'StructureView');
        signals.emitters.unregisterOutboundFormat('document', 'StructureView');
    },
    render() {
        return (
            <div id="nc-strv-frame">
                <ContextMenus/>
                <div id="nc-strv-corner-menus">
                    <HeaderBar/>
                    <ExpandedSectionView/>
                    <StavesStructure/>
                    <Collaboration/>
                </div>
                <div id="nc-strv-view">
                    <ActiveSections openContextMenu={this.showSectionContextMenu}/>
                </div>
            </div>
        );
    },
});

export default StructureView;
