import {normalize, strings} from '@angular-devkit/core';
import {apply, mergeWith, move, Rule, SchematicContext, template, Tree, url} from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngGenerateCmss(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const sourceTemplates = url('./files');
        const sourceParametrizedTemplates = apply(sourceTemplates, [
            move(normalize(_options.path)),
            template({
                ..._options,
                ...strings
            })
        ]);

        return mergeWith(sourceParametrizedTemplates)(tree, _context);

    };
}
