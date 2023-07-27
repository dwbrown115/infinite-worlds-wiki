import { PureComponent } from "react";

class ImageLoader extends PureComponent {
    state = {
        source: null,
    };

    componentDidMount() {
        const { url } = this.props;
    }

    render() {
        return <img src={this.state.source} alt="content_id_img.jpg" />;
    }
}

export default ImageLoader;
