<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/matheusbrasil/agendamento-siga">
    <img src="images/logo.jpg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">SIGA-BOT</h3>

  <p align="center">
    A robot created to monitor the availability of places to schedule the renewal of a residence permit.
    <br />
    <a href="https://github.com/matheusbrasil/agendamento-siga"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/matheusbrasil/agendamento-siga">View Demo</a>
    ·
    <a href="https://github.com/matheusbrasil/agendamento-siga/issues">Report Bug</a>
    ·
    <a href="https://github.com/matheusbrasil/agendamento-siga/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This repository hosts a bot designed to streamline monitoring of the [SIGA](https://siga.marcacaodeatendimento.pt/) platform. The bot automates monitoring processes and notifies users through BotFather on Telegram, ensuring efficient and timely updates.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With
* [![Node][Node.js]][Node-url]
* [![Telegram][Telegram]][Telegram-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at [BotFather](https://core.telegram.org/bots/tutorial#getting-ready)
2. Clone the repo
   ```sh
   git clone https://github.com/matheusbrasil/agendamento-siga.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `.env`
   ```text
    BOT_FATHER_API_KEY='ENTER YOUR API KEY'
    NTBA_FIX_350=1
   ```
5. Create the comands `/start`, `/stop`, and, `/checkdistrict` following the steps found on [BotFather](https://core.telegram.org/bots/tutorial#creating-your-command)

6. Run the project
   ```sh
   npm start
   ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/matheusbrasil/agendamento-siga/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the GPL V3. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Matheus Brasil - [@matheusrbrasil](https://twitter.com/matheusrbrasil)

Project Link: [https://github.com/matheusbrasil/agendamento-siga](https://github.com/matheusbrasil/agendamento-siga)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/matheusbrasil/agendamento-siga.svg?style=for-the-badge
[contributors-url]: https://github.com/matheusbrasil/agendamento-siga/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/matheusbrasil/agendamento-siga.svg?style=for-the-badge
[forks-url]: https://github.com/matheusbrasil/agendamento-siga/network/members
[stars-shield]: https://img.shields.io/github/stars/matheusbrasil/agendamento-siga.svg?style=for-the-badge
[stars-url]: https://github.com/matheusbrasil/agendamento-siga/stargazers
[issues-shield]: https://img.shields.io/github/issues/matheusbrasil/agendamento-siga.svg?style=for-the-badge
[issues-url]: https://github.com/matheusbrasil/agendamento-siga/issues
[license-shield]: https://img.shields.io/github/license/matheusbrasil/agendamento-siga.svg?style=for-the-badge
[license-url]: https://github.com/matheusbrasil/agendamento-siga/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/matheusbrasil
[product-screenshot]: images/logo.jpg
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[Node.js]:https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]:https://nodejs.org/
[SIGA-url]:https://siga.marcacaodeatendimento.pt/
[Telegram]:https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white
[Telegram-url]:https://telegram.org/