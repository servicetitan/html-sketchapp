export default function collapseAllGroups(context) {
  const doc = context.document;
  const currentArtboard = doc.findCurrentArtboardGroup();

  // deselect all layers
  context.api().selectedDocument.selectedPage.selectedLayers.clear();

  const action = doc.actionsController().actionForID('MSCollapseAllGroupsAction');

  if (action.validate()) {
    action.doPerformAction(null);
    if (currentArtboard !== null) {
      currentArtboard.select_byExpandingSelection(true, false);
    }
  } else {
    console.log('Failed to perform MSCollapseAllGroupsAction: invalid action ID.');
  }
}
