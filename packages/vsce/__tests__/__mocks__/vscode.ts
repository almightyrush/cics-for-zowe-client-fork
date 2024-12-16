module.exports = require("jest-mock-vscode").createVSCodeMock(jest);
export interface TreeViewExpansionEvent<T> {
    /**
     * Element that is expanded or collapsed.
     */
    readonly element: T;
}
export interface TreeView<T> {
    /**
     * An optional human-readable message that will be rendered in the view.
     * Setting the message to null, undefined, or empty string will remove the message from the view.
     */
    message?: string;

    /**
     * The tree view title is initially taken from the extension package.json
     * Changes to the title property will be properly reflected in the UI in the title of the view.
     */
    title?: string;

    /**
     * An optional human-readable description which is rendered less prominently in the title of the view.
     * Setting the title description to null, undefined, or empty string will remove the description from the view.
     */
    description?: string;

    /**
     * Reveals the given element in the tree view.
     * If the tree view is not visible then the tree view is shown and element is revealed.
     *
     * By default revealed element is selected.
     * In order to not to select, set the option `select` to `false`.
     * In order to focus, set the option `focus` to `true`.
     * In order to expand the revealed element, set the option `expand` to `true`. To expand recursively set `expand` to the number of levels to expand.
     * **NOTE:** You can expand only to 3 levels maximum.
     *
     * **NOTE:** The {@link TreeDataProvider} that the `TreeView` {@link window.createTreeView is registered with} with must implement {@link TreeDataProvider.getParent getParent} method to access this API.
     */
    reveal(element: T, options?: { select?: boolean; focus?: boolean; expand?: boolean | number }): Thenable<void>;
}
