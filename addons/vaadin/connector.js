window.Vaadin.Flow.tinymceEditorConnector = {
    initLazy: function (customConfig, c, textArea, options) {
        // Check whether the connector was already initialized for the datepicker
        if (c.$connector) {
            return;
        }

        let currentValue = "";

        c.$connector = {
            setEditorContent : function(html) {
                // this.editor.setContent(html)
                currentValue = html
            },

            replaceSelectionContent : function(html) {
                this.editor.selection.setContent(html);
            },

            focus : function() {
                this.editor.focus();
            },

            setEnabled : function(enabled) {
                this.editor.mode.set(enabled ? "design" : "readonly");
            }
        };

        const pushChanges = function() {
            c.$server.updateValue(currentValue)
        }

        const pushOnChangeValue = function () {
            c.$server.onChangeValue(currentValue)
        }

        const baseConfig = JSON.parse(customConfig) || {};
        Object.assign(baseConfig, options);

        // Height defined in Java component, always just adapt to that
        baseConfig['height'] = "100%";
        baseConfig['target'] = textArea;

        // Setup tiny-mce editor
        baseConfig['setup'] = function(ed) {
            c.$connector.editor = ed;
            ed.on('init', function (e) {
                console.log("Init TinyMCE editor....")
                ed.setContent(currentValue)
            })
            ed.on('setContent', function(e) {
                // currentValue = ed.getContent();
            });
            ed.on('change', function(e) {
                currentValue = ed.getContent();
                pushOnChangeValue()
            });
            ed.on('blur', function(e) {
                currentValue = ed.getContent();
                pushChanges();
            });
        };

        tinymce.init(baseConfig);
    }
}