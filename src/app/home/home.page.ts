import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('cesiumViewer', null) cesiumViewer: ElementRef<HTMLDivElement>;

  private viewer;

  constructor() {}

  ngAfterViewInit(): void {
    this.viewer = this.createViewer(this.cesiumViewer.nativeElement);
  }

  /**
   * Creates and returns a new cesium viewer instance.
   * 
   * @param {HTMLDivElement} element 
   * @return {Cesium.Viewer} the new instance
   */
  private createViewer(element: HTMLDivElement | string): any {
    Cesium.Label.enableRightToLeftDetection = true;
    return new Cesium.Viewer(element, {
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: true,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      imageryProvider: null,
      baseLayerPicker: false,
      animation: false,
      terrainProvider: null,
      selectionIndicator: false,
      projectionPicker: false,
      sceneMode: Cesium.SceneMode.SCENE2D,
      shadows: false,
      orderIndependentTranslucency: false
    });
  }
}
