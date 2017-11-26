class AlbumCover extends Component {
  render() {
    const src = "https://example.com/image.png"; // A changer ;)
    return (<img src={src} style={{ width: 400, height: 400 }} >);
  }
}