'use strict';

const { firstMemberExpression } = require('../astUtils');

const disallowedMembers = ['pause', 'debug'];

module.exports = {
    meta: {
        docs: {
            description: 'cy.pause()/cy.debug stops commands from running to allow interaction, usually this isn\'t something we want to merge',
            recommended: false,
        },
    },
    create(context) {
        return {
            ExpressionStatement(node) {
                // <something>()
                //            ^~
                if (node.expression.type !== 'CallExpression') {
                    return;
                }

                // <something>.target()
                // ^~~~~~~~~~~~~~~~~~
                const { callee } = node.expression;
                if (callee.type !== 'MemberExpression') {
                    return;
                }

                // <something>.pause()
                //             ^~~~~
                const { property: { name: memberName } } = callee;
                if (disallowedMembers.indexOf(memberName) === -1) {
                    return;
                }

                // object.member().member.pause()
                // ^~~~~~
                const dotStart = firstMemberExpression(callee);
                if (!dotStart) {
                    return;
                }

                // object.member.pause()
                // ^~~~~~ accept
                // (b ? x : y).member.pause()
                // ^~~~~~~~~~~ ignore
                if (dotStart.type !== 'Identifier') {
                    return;
                }

                // cy.pause()
                // ^~ accept
                const { name: objectName } = dotStart;
                if (objectName !== 'cy') {
                    return;
                }

                context.report({
                    node,
                    message: `Do not use cy.${memberName}()`,
                });
            },
        };
    },
};
