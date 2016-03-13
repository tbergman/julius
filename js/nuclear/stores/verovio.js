// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/verovio.js
// Purpose:                NuclearJS Stores related to Verovio.
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


import {Store, toImmutable} from 'nuclear-js';
import signals from '../signals';
import {Vida} from '../../lib/vida';


// TODO: move all the Verovio-rendering stuff to here.

const MeiForVerovio = Store({
    // Representing the MEI document to send to Verovio.
    //
    // This should be a string.
    //

    getInitialState() {
        this.vida = new Vida();
        return toImmutable('');
    },

    initialize() {
        // Called once to initialize the Vida object
        this.on(signals.names.INITIALIZE_VIDA, this.initializeVida);

        this.on(signals.names.LOAD_MEI, this.loadMEI);
        this.on(signals.names.RENDER_TO_VEROVIO, renderToVerovio);
    },

    initializeVida(previousState, vidaParams) 
    {
        this.vida.setDefaults(vidaParams);
        if (this.mei) this.vida.refreshVerovio(this.mei);
    },

    loadMEI(previousState, mei)
    {
        this.mei = mei;
        if (this.vida) this.vida.refreshVerovio(this.mei);
    }
});


function renderToVerovio(previousState, payload) {
    return toImmutable(payload);
}


export default {
    MeiForVerovio: MeiForVerovio,
};
