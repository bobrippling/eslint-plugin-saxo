'use strict';

const { RuleTester } = require('eslint');
const rule = require('../../../src/rules/cy-developer');

const parserOptions = {
    sourceType: 'module',
    ecmaVersion: 6,
};

const doNotUseCyPauseError = { message: 'Do not use cy.pause()' };
const doNotUseCyDebugError = { message: 'Do not use cy.debug()' };

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('cy-pause', rule, {
    valid: [{
        code: 'other.pause()',
    }, {
        code: 'properties.pause',
    }, {
        code: 'pause()',
    }],
    invalid: [{
        code: 'cy.pause()',
        errors: [doNotUseCyPauseError],
    }, {
        code: 'cy.foo().pause()',
        errors: [doNotUseCyPauseError],
    }, {
        code: 'cy.foo().bar().pause()',
        errors: [doNotUseCyPauseError],
    }],
});

ruleTester.run('cy-debug', rule, {
    valid: [{
        code: 'other.debug()',
    }, {
        code: 'properties.debug',
    }, {
        code: 'debug()',
    }],
    invalid: [{
        code: 'cy.debug()',
        errors: [doNotUseCyDebugError],
    }, {
        code: 'cy.foo().debug()',
        errors: [doNotUseCyDebugError],
    }, {
        code: 'cy.foo().bar().debug()',
        errors: [doNotUseCyDebugError],
    }],
});
