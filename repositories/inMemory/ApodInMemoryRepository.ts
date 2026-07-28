import { Result } from "@/domain/shared/result"
import { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import { IApodRepository } from "@/domain/Apod/Dto/IApodRepository"
import { ApodRawReponse } from "@/domain/Apod/RawReponse/ApodRawResponse"
import { RequiredFieldsError, NotFoundError } from "@/domain/shared/errors"

export class ApodInMemoryRepository implements IApodRepository {
  
  // TODO pegar os diferentes casos de vídeo e usar para testes
  private readonly Apods: ApodRawReponse[] = [
    {
      concepts: "concept_tags functionality turned off in current service",
      copyright: "Gonzalo Laserna Vargas",
      date: "2026-07-28",
      explanation: "What's connecting these two volcanoes? In ancient folklore, the two volcanoes, Parinacota (left) and Pomerape (right), are connected by representing a mythical prince and princess who engaged in a forbidden romance.  Beneath the ground, the two peaks are not known to be connected by a common pool of hot magma, and neither volcano has erupted in the past 1000 years.  Above the ground, there is usually nothing in the sky that connects them -- except if you use careful timing and look from a specific location.  The featured well-planned image was captured from Bolivia in mid-April with a series of camera exposures taken on the same day and from the same location.  Then, Barnard's Loop appeared to connect the volcanic peaks. Also visible in the image is the Orion Nebula in the center, the star Betelgeuse on the right, and the Rosette Nebula on the upper right.    Sky Surprise: What picture did APOD feature on your birthday? (after 1995)",
      hdurl: "https://apod.nasa.gov/apod/image/2607/LoopVolcanos_Laserna_5815.jpg",
      media_type: "image",
      service_version: "v1",
      title: "Barnards Loop over Twin Volcanoes",
      url: "https://apod.nasa.gov/apod/image/2607/LoopVolcanos_Laserna_960.jpg"
    },
    {
      concepts: "concept_tags functionality turned off in current service",
      copyright: "Jorge Cham,\nPHD Comics",
      date: "2012-05-01",
      explanation: "What is all this fuss about the Higgs boson? The physics community is abuzz that a fundamental particle expected by the largely successful Standard Model of particle physics may soon be found by the huge Large Hadron Collider (LHC) at CERN in Europe. The term boson refers to a type of fundamental particle with similarities to the photon, while Higgs refers to Peter Higgs, a physicist who among others published research predicting the mechanism through which such a particle might act. The above animated cartoon explains in humorous but impressive detail why the Higgs boson is expected, and one method that the Large Hadron Collider is using to find it. Although some rumors hint that preliminary traces of the Higgs boson are already being found, even not finding this unusual particle would open the door to a new fundamental understanding of how our universe works.",
      media_type: "video",
      service_version: "v1",
      thumbnail_url: "https://i.vimeocdn.com/video/284014229-892c14c30fe69043710a7b571ee47b200dc5d3adf80cc5d46b8147e885069e29-d_640?region=us",
      title: "Higgs Boson Explained by Cartoon",
      url: "https://player.vimeo.com/video/41038445?portrait=0&color=c8b3df"
    },
    {
      concepts: "concept_tags functionality turned off in current service",
      date: "2012-05-02",
      explanation: "Although its colors may be subtle, Saturn's moon Helene is an enigma in any light. The moon was imaged in unprecedented detail last June as the robotic Cassini spacecraft orbiting Saturn swooped to within a single Earth diameter of the diminutive moon. Although conventional craters and hills appear, the above image also shows terrain that appears unusually smooth and streaked. Planetary astronomers are inspecting these detailed images of Helene to glean clues about the origin and evolution of the 30-km across floating iceberg. Helene is also unusual because it circles Saturn just ahead of the large moon Dione, making it one of only four known Saturnian moons to occupy a gravitational well known as a stable Lagrange point.   Dark Mysteries: Astronomy Seminar of the Week",
      hdurl: "https://apod.nasa.gov/apod/image/1205/helene2_cassini_1024.png",
      media_type: "image",
      service_version: "v1",
      title: "Saturn's Moon Helene in Color",
      url: "https://apod.nasa.gov/apod/image/1205/helene2_cassini_960.jpg"
    },    
    {
      concepts: "concept_tags functionality turned off in current service",
      date: "2012-05-04",
      explanation: "ring the cosmos at extreme energies, the Fermi Gamma-ray Space Telescope orbits planet Earth every 95 minutes. By design, it rocks to the north and then to the south on alternate orbits in order to survey the sky with its Large Area Telescope (LAT). The spacecraft also rolls so that solar panels are kept pointed at the Sun for power, and the axis of its orbit precesses like a top, making a complete rotation once every 54 days. As a result of these multiple cycles the paths of gamma-ray sources trace out complex patterns from the spacecraft's perspective, like this mesmerising plot of the path of the Vela Pulsar. Centered on the LAT instrument's field of view, the plot spans 180 degrees and follows Vela's position from August 2008 through August 2010. The concentration near the center shows that Vela was in the sensitive region of the LAT field during much of that period. Born in the death explosion of a massive star within our Milky Way galaxy, the Vela Pulsar is a neutron star spinning 11 times a second, seen as the brightest persistent source in the gamma-ray sky.",
      hdurl: "https://apod.nasa.gov/apod/image/1205/LatPolar_Vela.jpg",
      media_type: "image",
      service_version: "v1",
      title: "Fermi Epicycles: The Vela Pulsar's Path",
      url: "https://apod.nasa.gov/apod/image/1205/LatPolar_Vela900c.jpg"
    },
    {
      concepts: "concept_tags functionality turned off in current service",
      copyright: "Robert Arn",
      date: "2012-05-05",
      explanation: "Rising as the Sun sets, tonight's Full Moon could be hard to miss. Remarkably, its exact full phase (May 6 03:36 UT) will occur less than two minutes after it reaches perigee, the closest point to Earth in the Moon's orbit, making it the largest Full Moon of 2012. The Full Perigee Moon will appear to be some 14 percent larger and 30 percent brighter than a Full Moon near apogee, the most distant point in the elliptical lunar orbit. In comparison, though, it will appear less than 1 percent larger and almost as bright as April's Full Moon, captured in this telephoto image rising over suburban Fort Collins, Colorado, USA. For that lunation, Full Moon and perigee were about 21 hours apart. Of course, if you manage to miss May's Full Perigee Moon, make a note on your calendar. Your next chance to see a Full Moon close to perigee, will be next year on June 23.",
      hdurl: "https://apod.nasa.gov/apod/image/1205/FullMoonriseArn1250.jpg",
      media_type: "image",
      service_version: "v1",
      title: "Full Moonrise",
      url: "https://apod.nasa.gov/apod/image/1205/FullMoonriseArn600.jpg"
    },   
    {
      concepts: "concept_tags functionality turned off in current service",
      copyright: "Daniel L�pez\n(El Cielo de Canarias);\n Music:  La Busqueda de Ianna (Epic Soul Factory)",
      date: "2012-05-08",
      explanation: "What's moving? Time lapse videos of the sky can be quite spectacular when they last long enough for stars, planets, aurora, and clouds to appear to move in just a few seconds. Pictured above, however, astrovideographer Daniel L�pez not only treats us to several inspiring time lapse videos of the night sky, but shows us how he used sliders and motorized cranes to move the imaging cameras themselves, creating a thrilling three-dimensional sense of depth. The video sequences were taken from Tenerife on the Canary Islands of Spain over the past two months, and show scenes including sunset shadows approaching Observatorio del Teide, the Milky Way shifting as the sky rotates, bright planets Venus and trailing Jupiter setting, a reddened Moon rising through differing layers of atmospheric refraction, the MAGIC gamma-ray telescopes slewing to observe a new source, and unusual foreground objects including conic Echium wildpretii plants, unusual rock formations, and a spider moving about its web.  The video concludes by showing the Belt of Venus descending on Mt. Teide as the morning sun rises.   New Mirror: APOD is now available in Indonesian from Indonesia.",
      media_type: "video",
      service_version: "v1",
      thumbnail_url: "https://i.vimeocdn.com/video/259557140-15cba4e580d7dcec951a577a22f19b6cd14b4bfe59224d3d43706d9d963b26a8-d_640?region=us",
      title: "The Light of Stars",
      url: "https://player.vimeo.com/video/37752523?title=0&byline=0&portrait=0&color=c8b3df&autoplay=1"
    },
    {
      concepts: "concept_tags functionality turned off in current service",
      date: "2012-05-09",
      explanation: "What's that in the background? Two famous New York City icons stand tall in the above photo taken last week. On the left looms the Statue of Liberty, a universal symbol of freedom, while on the right rises the Empire State Building, now the second largest building in the city. What's unique about this once-in-a-lifetime photograph, though, is the third icon that appears to Lady Liberty's left. High in the air and far in the background flies the space shuttle Enterprise -- perched atop a 747 jet --  on the way to its new home. New Yorkers and visitors to the Big Apple can visit the test space shuttle at the Intrepid Sea, Air & Space Museum on the West Side of Manhattan starting July 19.   Neptune & Vulcan Astronomy Seminar of the Week",
      hdurl: "https://apod.nasa.gov/apod/image/1205/shuttlelibertyempire_nasa_836.jpg",
      media_type: "image",
      service_version: "v1",
      title: "Shuttle Enterprise Over New York",
      url: "https://apod.nasa.gov/apod/image/1205/shuttlelibertyempire_nasa_960.jpg"
    },   
    {
      concepts: "concept_tags functionality turned off in current service",
      date: "2025-12-08",
      explanation: "Many wonders are visible when flying over the Earth at night.  Such visual spectacles occur every day for astronauts in low Earth orbit, but the featured video captured several from the International Space Station (ISS) in 2011 and set them to rousing music.  Passing below are white clouds, orange city lights, lightning flashes in thunderstorms, and dark blue seas.  On the horizon is the golden haze of Earth's thin atmosphere, frequently decorated by dancing auroras as the video progresses.  The green parts of auroras typically remain below the space station, but the station flies right through the red and purple auroral peaks.  Solar panels of the ISS are seen around the frame edges.  The ominous wave of approaching brightness at the end of each sequence is just the dawn of the sunlit half of Earth, a dawn that occurs every 90 minutes.   Free APOD Lecture in Phoenix: This Wednesday (December 10) at 7 pm",
      media_type: "video",
      service_version: "v1",
      thumbnail_url: "https://img.youtube.com/vi/FG0fTKAqZ5g/0.jpg",
      title: "Flying Over the Earth at Night",
      url: "https://www.youtube.com/embed/FG0fTKAqZ5g?rel=0"
    }
  ]

  async findMany(start_date?: number, end_date?: number, count?: number): Promise<Result<RequiredFieldsError, ApodDto[]>> {
    throw new Error("Method not implemented.")
  }
  
  async findByDate(date: string): Promise<Result<NotFoundError, ApodDto>> {
    throw new Error("Method not implemented.")
  }
}