import { App } from '../../app.mjs';
import { render } from 'preact';
import { html } from 'htm/preact';

describe('App', function() {
    it('says hello', function() {
        const root = document.createDocumentFragment();
        render(
            html`
                <${App}/>`,
            root
        );

        const header = root.querySelector('h1');
        expect(header.textContent).toEqual('Hello, World!');
    });
});
