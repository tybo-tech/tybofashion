import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HomeNavUx, HomeTabModel, LoaderUx, NavHistoryUX } from 'src/models/UxModel.model';

@Injectable({
  providedIn: 'root'
})


export class UxService {


  private uxMessagePopBehaviorSubject: BehaviorSubject<string>;
  public uxMessagePopObservable: Observable<string>;

  private uxNavHistoryBehaviorSubject: BehaviorSubject<NavHistoryUX>;
  public uxNavHistoryObservable: Observable<NavHistoryUX>;

  private navBarLogoBehaviorSubject: BehaviorSubject<HomeNavUx>;
  public navBarLogoObservable: Observable<HomeNavUx>;

  private showIntroPageBehaviorSubject: BehaviorSubject<string>;
  public showIntroPageObservable: Observable<string>;

  private uxLoadingBehaviorSubject: BehaviorSubject<LoaderUx>;
  public uxLoadingPopObservable: Observable<LoaderUx>;

  private uxHomeSideNavBehaviorSubject: BehaviorSubject<boolean>;
  public uxHomeSideNavObservable: Observable<boolean>;

  private showQuickLoginBehaviorSubject: BehaviorSubject<boolean>;
  public showQuickLoginObservable: Observable<boolean>;


  private pageYPositionBehaviorSubject: BehaviorSubject<number>;
  public pageYPositionObservable: Observable<number>;

  private homeTabBehaviorSubject: BehaviorSubject<HomeTabModel>;
  public homeTabObservable: Observable<HomeTabModel>;

  constructor() {
    this.uxMessagePopBehaviorSubject = new BehaviorSubject<string>(null);
    this.uxMessagePopObservable = this.uxMessagePopBehaviorSubject.asObservable();

    this.uxLoadingBehaviorSubject = new BehaviorSubject<LoaderUx>(null);
    this.uxLoadingPopObservable = this.uxLoadingBehaviorSubject.asObservable();

    this.navBarLogoBehaviorSubject = new BehaviorSubject<HomeNavUx>(JSON.parse(localStorage.getItem('HomeNavUx')));
    this.navBarLogoObservable = this.navBarLogoBehaviorSubject.asObservable();

    this.showIntroPageBehaviorSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('ShowIntroPage')));
    this.showIntroPageObservable = this.showIntroPageBehaviorSubject.asObservable();


    this.uxNavHistoryBehaviorSubject = new BehaviorSubject<NavHistoryUX>(null);
    this.uxNavHistoryObservable = this.uxNavHistoryBehaviorSubject.asObservable();


    this.uxHomeSideNavBehaviorSubject = new BehaviorSubject<boolean>(null);
    this.uxHomeSideNavObservable = this.uxHomeSideNavBehaviorSubject.asObservable();

    this.showQuickLoginBehaviorSubject = new BehaviorSubject<boolean>(false);
    this.showQuickLoginObservable = this.showQuickLoginBehaviorSubject.asObservable();


    this.pageYPositionBehaviorSubject = new BehaviorSubject<number>(null);
    this.pageYPositionObservable = this.pageYPositionBehaviorSubject.asObservable();

    this.homeTabBehaviorSubject = new BehaviorSubject<HomeTabModel>(JSON.parse(localStorage.getItem('HomeTabState')));
    this.homeTabObservable = this.homeTabBehaviorSubject.asObservable();

  }

  public get currentMessagePopValue(): string {
    return this.uxMessagePopBehaviorSubject.value;
  }

  public get currentNavBarLogoValue(): HomeNavUx {
    return this.navBarLogoBehaviorSubject.value;
  }

  updatePageYPositionState(state: number) {
    if (state) {
      this.pageYPositionBehaviorSubject.next(state);
    }
  }
  updateHomeTabModelState(state: HomeTabModel) {
    if (state) {
      this.homeTabBehaviorSubject.next(state);
      localStorage.setItem('HomeTabState', JSON.stringify(state));
    }
  }
  showQuickMessage(state: string) {
    if (state) {
      this.uxMessagePopBehaviorSubject.next(state);
    }
  }
  updateNavBarLogoState(state: HomeNavUx) {
    if (state) {
      this.navBarLogoBehaviorSubject.next(state);
      localStorage.setItem('HomeNavUx', JSON.stringify(state));
    }
  }
  updateLoadingState(state: LoaderUx) {
    if (state) {
      this.uxLoadingBehaviorSubject.next(state);
    }
  }

  closeQuickLogin() {
    this.showQuickLoginBehaviorSubject.next(false);
  }
  openTheQuickLogin() {
    this.showQuickLoginBehaviorSubject.next(true);
  }
  hideLoader() {
    this.uxLoadingBehaviorSubject.next({ Loading: false, Message: undefined });
  }
  showLoader() {
    this.uxLoadingBehaviorSubject.next(({ Loading: true, Message: 'Loading, please wait.' }));
  }
  hideHomeSideNav() {
    this.uxHomeSideNavBehaviorSubject.next(false);
  }
  showHomeSideNav() {
    this.uxLoadingBehaviorSubject.next(({ Loading: true, Message: 'Loading, please wait.' }));
  }
  keepNavHistory(item: NavHistoryUX) {
    this.uxNavHistoryBehaviorSubject.next(item);
  }
  updateShowIntroPageState(state: string) {
    this.showIntroPageBehaviorSubject.next(state);
    localStorage.setItem('ShowIntroPage', JSON.stringify(state));
  }
}

