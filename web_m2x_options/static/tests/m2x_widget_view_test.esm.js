/** @odoo-module **/
/* global QUnit */
import {makeView, setupViewRegistries} from "@web/../tests/views/helpers";
import {patchWithCleanup} from "@web/../tests/helpers/utils";
import {session} from "@web/session";

let serverData = {};

QUnit.module("Many2X Widget View Test", (hooks) => {
    hooks.beforeEach(() => {
        patchWithCleanup(session, {web_m2x_options: {}});
        serverData = {
            models: {
                "res.users": {
                    fields: {
                        name: {string: "Name", type: "char"},
                        many2one_relation_field: {
                            string: "M2O",
                            type: "many2one",
                            relation: "res.users",
                        },
                        many2many_relation_field: {
                            string: "M2M",
                            type: "many2many",
                            relation: "res.users",
                        },
                    },
                    records: [
                        {
                            id: 1,
                            name: "User 1",
                            many2one_relation_field: 3,
                            many2many_relation_field: [2, 3],
                        },
                        {
                            id: 2,
                            name: "User 2",
                            many2one_relation_field: 1,
                            many2many_relation_field: [1],
                        },
                        {id: 3, name: "User 3"},
                    ],
                },
            },
        };
        setupViewRegistries();
    });

    QUnit.test("Many2one relation", async function (assert) {
        assert.expect(1);
        await makeView({
            type: "form",
            resModel: "res.users",
            serverData,
            arch: `
            <form string="M2O Test">
                <field name="many2one_relation_field" widget="many2one" options="{'limit': 8, 'field_color': 'green', 'search_more': false, 'colors': {'green': '#00FF00'}}" />
            </form>`,
            resId: 1,
        });
        assert.equal($("input[id^='many2one_relation_field']").length, 1);
    });

    QUnit.test("Many2many relation", async function (assert) {
        assert.expect(1);
        await makeView({
            type: "form",
            resModel: "res.users",
            serverData,
            arch: `<form string="M2M Test">
                <field name="many2many_relation_field" widget="many2many" options="{'limit': 8, 'field_color': 'green', 'search_more': false, 'colors': {'green': '#00FF00'}}">
                    <tree>
                        <field name="name" />
                    </tree>
                </field>
            </form>`,
            resId: 1,
        });
        assert.ok($("input[id^='many2many_relation_field']"));
    });

    QUnit.test("Many2many_tags Test", async function (assert) {
        assert.expect(1);
        await makeView({
            type: "form",
            resModel: "res.users",
            serverData,
            arch: `<form string="M2M Test">
                <field name="many2many_relation_field" widget="many2many_tags" options="{'limit': 8, 'field_color': 'green', 'search_more': false, 'colors': {'green': '#00FF00'}}">
                    <tree>
                        <field name="name" />
                    </tree>
                </field>
            </form>`,
            resId: 1,
        });
        assert.ok($("input[name^='many2many_relation_field']"));
    });

    QUnit.test("AvatarMany2Many Test", async function (assert) {
        assert.expect(1);
        await makeView({
            type: "kanban",
            resModel: "res.users",
            serverData,
            arch: `<kanban string="M2M Test">
                <templates>
                    <t t-name="kanban-box">
                        <div>
                            <field name="many2many_relation_field" widget="many2many_tags_avatar" options="{'limit': 8, 'field_color': 'green', 'search_more': false, 'colors': {'green': '#00FF00'}}"/>
                        </div>
                    </t>
                </templates>
            </kanban>`,
        });
        assert.ok($("input[name='many2many_relation_field']"));
    });

    QUnit.test("AvatarMany2One Test", async function (assert) {
        assert.expect(1);
        await makeView({
            type: "kanban",
            resModel: "res.users",
            serverData,
            arch: `<kanban string="M2M Test">
                <templates>
                    <t t-name="kanban-box">
                        <div>
                            <field name="many2one_relation_field" widget="many2one_avatar" options="{'limit': 8, 'field_color': 'green', 'search_more': false, 'colors': {'green': '#00FF00'}}"/>
                        </div>
                    </t>
                </templates>
            </kanban>`,
        });
        assert.ok($("input[name='many2many_relation_field']"));
    });
});
