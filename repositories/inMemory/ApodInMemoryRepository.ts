import { ApodDto, ApodPage } from "@/domain/Apod/Dto/ApodDto"
import { Mapper } from "@/repositories/helpers/mapper"
import { Result, success, error } from "@/domain/shared/result"
import { IApodRepository } from "@/domain/Apod/Dto/IApodRepository"
import { ApodRawResponse } from "@/domain/Apod/RawResponse/ApodRawResponse"
import {
  NotFoundError,
  InternalServerError,
  UnauthorizedServerError,
  InvalidDataError
} from "@/domain/shared/errors"

// TODO adicionar mais cenários de erro (vídeo sem mídia, página vazia) para os testes
export class ApodInMemoryRepository implements IApodRepository {

  private readonly Apods: ApodRawResponse[] = [
    {
      post_id: 1499061,
      date: "2026-10-23",
      title: "Andromeda in Southern Spring",
      permalink: "https://science.nasa.gov/image-article/apod-2026-october-23-andromeda-in-southern-spring/",
      media_type: "image",
      explanation: "<strong>Explanation:</strong> Looking toward the north from Mullion, New South Wales, Australia, the Andromeda Galaxy never gets more than a few degrees above the horizon.",
      credit: "<a href=\"https://www.astrolucyhu.com/about-lucy\">Lucy Yunxi Hu</a>",
      copyright: "<a href=\"https://www.astrolucyhu.com/about-lucy\">Lucy Yunxi Hu</a>",
      alt: "The Andromeda galaxy above rolling hills.",
      url: "https://science.nasa.gov/image-article/apod-2026-october-23-andromeda-in-southern-spring/",
      hdurl: "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/october/APOD_Lucy.jpg?w=3000&h=2004&fit=clip&crop=faces%2Cfocalpoint",
      basic_html: "<center><a href=\"https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/october/APOD_Lucy.jpg\"><IMG SRC=\"https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/october/APOD_Lucy.jpg\"></a></center>",
    },
    {
      post_id: 1497603,
      date: "2026-10-22",
      title: "The First Green Star, WD J1330+6435",
      permalink: "https://science.nasa.gov/image-article/apod-2026-october-22-the-first-green-star-wd-j13306435/",
      media_type: "image",
      explanation: "<strong>Explanation:</strong> Star light, star bright: is there a green star out tonight?",
      credit: "<a href=\"https://markgarlick.com/\">Mark A. Garlick</a>/<a href=\"https://warwick.ac.uk\">University of Warwick</a>",
      copyright: "<a href=\"https://markgarlick.com/\">Mark A. Garlick</a>/<a href=\"https://warwick.ac.uk\">University of Warwick</a>",
      alt: "A star shines with a greenish hue in front of a dark field with more distant stars.",
      url: "https://science.nasa.gov/image-article/apod-2026-october-22-the-first-green-star-wd-j13306435/",
      hdurl: "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/october/green_wd_mark-garlick_annotated2.jpg?w=1280&h=1280&fit=clip&crop=faces%2Cfocalpoint",
      basic_html: "",
    },
    {
      post_id: 1258485,
      date: "2026-07-03",
      title: "Three Galaxies in Pavo",
      permalink: "https://science.nasa.gov/image-article/apod-2026-july-3-three-galaxies-in-pavo/",
      media_type: "image",
      explanation: "<strong>Explanation:</strong> Some 190 million light-years away, these three galaxies are drawn together by gravity.",
      credit: "<b> Image Credit &amp; <a href=\"https://apod.nasa.gov/apod/lib/about_apod.html#srapply\">Copyright</a>: </b> <a href=\"https://throughlightandtime.com/about/\" target=\"_blank\">Mike Selby</a>",
      copyright: "<b> Image Credit &amp; <a href=\"https://apod.nasa.gov/apod/lib/about_apod.html#srapply\">Copyright</a>: </b> <a href=\"https://throughlightandtime.com/about/\" target=\"_blank\">Mike Selby</a>",
      alt: "See Explanation. Clicking on the picture will download the highest resolution version available.",
      url: "https://science.nasa.gov/image-article/apod-2026-july-3-three-galaxies-in-pavo/",
      hdurl: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/july/NGC6769LRGBcropAZ-1500-20-May-2026.jpg?w=3790&h=3389&fit=clip&crop=faces%2Cfocalpoint",
      basic_html: "",
    },
    {
      post_id: 1499050,
      date: "2026-10-16",
      title: "Chasing the International Space Station",
      permalink: "https://science.nasa.gov/image-article/apod-2026-october-16-chasing-the-international-space-station/",
      media_type: "video",
      explanation: "<strong>Explanation:</strong> Blasting into the predawn sky, a Falcon 9 rocket and Dragon spacecraft are headed for low Earth orbit.",
      credit: "<a href=\"https://www.youtube.com/user/eric72holland\">Eric Holland</a>",
      copyright: "<a href=\"https://www.youtube.com/user/eric72holland\">Eric Holland</a>",
      alt: "",
      url: "https://science.nasa.gov/image-article/apod-2026-october-16-chasing-the-international-space-station/",
      hdurl: "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/october/CRS35-Holland30s1080p.jpg?w=1620&h=1080&fit=clip&crop=faces%2Cfocalpoint",
      basic_html: "<video controls title=\"\"><source src=\"https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/october/CRS35-Holland30s1080p.mp4\" type=\"video/mp4\"></video>",
    },
    {
      post_id: 1200001,
      date: "2025-12-08",
      title: "Flying Over the Earth at Night",
      permalink: "https://science.nasa.gov/image-article/apod-2025-december-8-flying-over-the-earth-at-night/",
      media_type: "video",
      explanation: "<strong>Explanation:</strong> Many wonders are visible when flying over the Earth at night.",
      credit: "",
      copyright: "",
      alt: "",
      url: "https://science.nasa.gov/image-article/apod-2025-december-8-flying-over-the-earth-at-night/",
      hdurl: "https://assets.science.nasa.gov/dynamicimage/assets/science/astro/programs/cosmic-origins/images/misc/news-thumbnail.png?w=594&h=516&fit=clip&crop=faces%2Cfocalpoint",
      basic_html: "<iframe width=\"960\" height=\"540\" src=\"//www.youtube.com/embed/FG0fTKAqZ5g?rel=0\" frameborder=\"0\" allowfullscreen></iframe>",
    },
  ]

  private readonly mapper = new Mapper()

  async findMany(start_date?: string, end_date?: string, page = 1, per_page = 25): Promise<Result<InvalidDataError | InternalServerError | UnauthorizedServerError, ApodPage>> {

    const filtered = this.Apods
      .filter((apod) => !start_date || !end_date || (apod.date >= start_date && apod.date <= end_date))
      .sort((a, b) => b.date.localeCompare(a.date))

    const offset = (page - 1) * per_page
    const items: ApodDto[] = filtered.slice(offset, offset + per_page).map((apod) => this.mapper.rawToDomain(apod))

    return success({
      items,
      page,
      per_page,
      total: filtered.length,
      total_pages: Math.ceil(filtered.length / per_page),
    })
  }

  async findByDate(date: string): Promise<Result<NotFoundError | InvalidDataError | InternalServerError | UnauthorizedServerError, ApodDto>> {

    const raw_data: ApodRawResponse | undefined = this.Apods.find((apod) => apod.date === date)

    if (raw_data) {
      const apod: ApodDto = this.mapper.rawToDomain(raw_data)
      return success(apod)
    }

    return error(new NotFoundError(`${date}`))
  }

}
