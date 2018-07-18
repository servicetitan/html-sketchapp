export default function collapseAllGroups(context) {
  var doc = context.document
  var currentArtboard = doc.findCurrentArtboardGroup()

  // deselect all layers
  context.api().selectedDocument.selectedPage.selectedLayers.clear()

  var action = doc.actionsController().actionForID("MSCollapseAllGroupsAction")

  if(action.validate()) {
    action.doPerformAction(nil)
    if(currentArtboard !== null) {
      currentArtboard.select_byExpandingSelection(true, false)
    }
  } else {
    log("Failed to perform MSCollapseAllGroupsAction: invalid action ID.")
  }
}
