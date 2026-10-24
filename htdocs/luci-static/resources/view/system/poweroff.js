'use strict';
'require view';
'require ui';
'require fs';
'require uci';

return view.extend({
    load: function() {
        return uci.changes().catch(function() {
            return {};
        });
    },

    render: function(changes) {
        var nodes = [
            E('h2', {}, _('Power Off')),
            E('p', { class: 'cbi-section-descr' }, _('Turn off the power to the device you are using'))
        ];

        if (changes && Object.keys(changes).length)
            nodes.push(E('p', { class: 'alert-message warning' },
                _('Warning: There are unsaved changes that will be lost when the device powers off!')));

        nodes.push(E('div', { class: 'cbi-page-actions right' }, [
            E('button', {
                class: 'cbi-button cbi-button-negative important',
                click: ui.createHandlerFn(this, 'handlePowerOff')
            }, _('Perform Power Off'))
        ]));

        return E(nodes);
    },

    handlePowerOff: function() {
        return ui.showModal(_('⚠️ Power Off Device'), [
            E('div', { class: 'alert-message warning' }, [
                E('h4', {}, _('Warning!')),
                E('p', {},
                    _('This action will immediately turn off the power to your device. Make sure to save all your work before proceeding.'))
            ]),

            E('p', {}, E('strong', {}, _('Before you continue:'))),
            E('ul', {}, [
                E('li', {}, _('Save all unsaved settings')),
                E('li', {}, _('Check if other users are active')),
                E('li', {}, _('The device needs to be manually turned on'))
            ]),

            E('div', { class: 'right' }, [
                E('button', {
                    class: 'cbi-button cbi-button-apply',
                    click: ui.hideModal
                }, _('Cancel')),
                ' ',
                E('button', {
                    class: 'cbi-button cbi-button-negative',
                    click: ui.createHandlerFn(this, function() {
                        ui.hideModal();

                        // Show powering off modal
                        ui.showModal(_('Powering Off'), [
                            E('h3', {}, _('Powering off device...')),
                            E('p', { class: 'spinning' },
                                _('The device should power off within a few seconds. If the device remains on, you may need to perform a manual shutdown.'))
                        ]);

                        // The device may power off before the RPC request can
                        // complete, in which case no response or error would
                        // ever replace the dialog. Dismiss it after 15 seconds
                        // so the page does not appear to hang.
                        var closeTimer = window.setTimeout(function() {
                            ui.hideModal();
                        }, 15000);

                        // Show an error and close the powering off modal
                        var showError = function(msg) {
                            window.clearTimeout(closeTimer);
                            ui.hideModal();
                            ui.addNotification(_('Error!'), E('p', {}, [ msg ]), 'danger');
                        };

                        // Execute poweroff command
                        return fs.exec('/sbin/poweroff').then(function(res) {
                            if (!res || res.code !== 0) {
                                var msg = (res && res.stderr ? res.stderr : '').trim();

                                showError(msg || _('Power off failed with code %s').format(res ? res.code : '?'));
                            }
                        }).catch(function(e) {
                            // When the device really powers off, the pending
                            // RPC request is aborted or times out. Keep the
                            // "Powering Off" modal in that case and only
                            // report genuine command or permission errors.
                            if (e && /^XHR request (timed out|aborted by browser)$/.test(e.message))
                                return;

                            showError(e.message);
                        });
                    })
                }, _('Confirm Power Off'))
            ])
        ]);
    },

    handleSaveApply: null,
    handleSave: null,
    handleReset: null
});
