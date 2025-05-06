import {directive, Directive, PartInfo, PartType} from 'lit/directive.js';

class ResolveUrlDirective extends Directive {

    constructor(partInfo: PartInfo) {
        super(partInfo);
        if (partInfo.type !== PartType.ATTRIBUTE) {
            throw new Error('resolveUrl directive must be used in an attributes requiring url (e.g., href, src). ');
        }

        const allowedAttributes = ['href', 'src', 'data-url'];
        if (!allowedAttributes.includes(partInfo.name)) {
            throw new Error(`resolveUrl directive can only be used on one of: ${allowedAttributes.join(', ')}`);
        }
    }

    private _resolvedUrl(url: string): string {
        if (url.startsWith('/'))
            return import.meta.env.BASE_URL + url;
        else
            return url;
    }

    render(url: string | undefined) {
        return this._resolvedUrl(url ?? '');
    }
}

export const resolveUrl = directive(ResolveUrlDirective);