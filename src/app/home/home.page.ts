import { Component, ElementRef, ViewChild } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('cesiumViewer', null) cesiumViewer: ElementRef<HTMLDivElement>;

  /**
   * The main {Cesium.Viewer}
   */
  private viewer;

  coords = {
    altitude: 0,
    latitude: 0,
    longitude: 0
  };

  follow = true;

  constructor(private geolocation: Geolocation, private platform: Platform) { }

  ngAfterViewInit(): void {
    this.viewer = this.createViewer(this.cesiumViewer.nativeElement);
    this.viewer.entities.add(this.createUserPositionIcon('ID_USER'));

    // Watch position changes
    this.platform.ready().then(() =>
      this.geolocation
        .watchPosition({ enableHighAccuracy: true, maximumAge: 0 })
        .pipe(filter(x => (x as any).coords)) // Only if it has coordinates 
        .subscribe(pos => this.handleNewPosition((pos as Geoposition).coords))
    );
  }

  /**
   * Creates and returns a new cesium viewer instance.
   * 
   * @param element 
   * @return {Cesium.Viewer} The new viewer instance
   */
  private createViewer(element: HTMLDivElement): any {
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
      baseLayerPicker: true,
      animation: false,
      selectionIndicator: false,
      projectionPicker: false,
      sceneMode: Cesium.SceneMode.SCENE2D,
      shadows: false,
      orderIndependentTranslucency: false
    });
  }

  /**
   * Creates and returns a new cesium entity with the given id.
   * 
   * @param id
   * @return {Cesium.Entity} The new entity instance
   */
  private createUserPositionIcon(id: string): any {
    return new Cesium.Entity({
      id: id,
      name: 'User Position',
      editable: false,
      own: true,
      cc: 0,
      position: Cesium.Cartesian3.fromDegrees(0, 0, 0),
      billboard: {
        image: "assets/maki/marker.png",
        scale: 2.0,
        color: Cesium.Color.LAWNGREEN,
        width: 25,
        height: 25
      },
    });
  }

  /**
   * Handle when exists a new position.
   * 
   * @param coords The new position coordinates.
   */
  private handleNewPosition(coords: Coordinates): void {
    // Update entity position
    const entity = this.viewer.entities.getById('ID_USER');
    entity.position = Cesium.Cartesian3.fromDegrees(coords.longitude, coords.latitude, coords.altitude);

    if (this.follow) {
      this.centerPosition();
    }

    // Update inticators
    this.coords = coords;
  }

  /**
   * Center Cesium camera to the user position
   */
  centerPosition(): void {
    this.viewer.scene.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(this.coords.longitude, this.coords.latitude, 3000),
      duration: 0
    });
  }
}
