import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { immutableAssign } from '@app/shared/misc/utils'
import { AuthService } from '../../core/auth'
import { AbstractVideoList } from '../../shared/video/abstract-video-list'
import { VideoSortField } from '../../shared/video/sort-field.type'
import { VideoService } from '../../shared/video/video.service'
import { I18n } from '@ngx-translate/i18n-polyfill'
import { ScreenService } from '@app/shared/misc/screen.service'
import { Notifier, ServerService } from '@app/core'
import { HooksService } from '@app/core/plugins/hooks.service'

@Component({
  selector: 'my-videos-recently-added',
  styleUrls: [ '../../shared/video/abstract-video-list.scss' ],
  templateUrl: '../../shared/video/abstract-video-list.html'
})
export class VideoRecentlyAddedComponent extends AbstractVideoList implements OnInit, OnDestroy {
  titlePage: string
  sort: VideoSortField = '-publishedAt'
  groupByDate = true

  useUserVideoLanguagePreferences = true

  constructor (
    protected i18n: I18n,
    protected route: ActivatedRoute,
    protected serverService: ServerService,
    protected router: Router,
    protected notifier: Notifier,
    protected authService: AuthService,
    protected screenService: ScreenService,
    private videoService: VideoService,
    private hooks: HooksService
  ) {
    super()

    this.titlePage = i18n('Recently added')
  }

  ngOnInit () {
    super.ngOnInit()

    this.generateSyndicationList()
  }

  ngOnDestroy () {
    super.ngOnDestroy()
  }

  getVideosObservable (page: number) {
    const newPagination = immutableAssign(this.pagination, { currentPage: page })
    const params = {
      videoPagination: newPagination,
      sort: this.sort,
      categoryOneOf: this.categoryOneOf,
      languageOneOf: this.languageOneOf
    }

    return this.hooks.wrapObsFun(
      this.videoService.getVideos.bind(this.videoService),
      params,
      'common',
      'filter:api.recently-added-videos.videos.list.params',
      'filter:api.recently-added-videos.videos.list.result'
    )
  }

  generateSyndicationList () {
    this.syndicationItems = this.videoService.getVideoFeedUrls(this.sort, undefined, this.categoryOneOf)
  }
}
