import * as _ from 'lodash';

function resolveAllOf(inputSpec: any): any {
    if (inputSpec && typeof inputSpec === 'object') {
        if (Object.keys(inputSpec).length > 0) {
            if (inputSpec.allOf) {
                const allOf = inputSpec.allOf;
                delete inputSpec.allOf;
                const nested = _.mergeWith({}, ...allOf, customizer);
                inputSpec = _.defaultsDeep(inputSpec, nested, customizer);
                if (inputSpec.allOf) {
                    inputSpec = resolveAllOf(inputSpec)
                }
            }
            Object.keys(inputSpec).forEach((key: string) => {
                inputSpec[key] = resolveAllOf(inputSpec[key]);
            });
        }
    }
    return inputSpec;
}

const customizer = (objValue: any, srcValue: any) => {
    if (_.isArray(objValue)) {
        return _.union(objValue, srcValue);
    }
    return;
};

export = resolveAllOf;
