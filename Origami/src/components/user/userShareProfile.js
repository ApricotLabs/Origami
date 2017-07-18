import React, { PropTypes } from "react";
import { getAllPermalink } from "../../api/Nongh/permalink";
import { getDeployed } from "../../api/Nongh/getDeployed";
import { is_cloudcv } from "../../api/Generic/getCloudCVDemos";
import userApi from "../../api/Github/userApi";
import { indigo600 } from "material-ui/styles/colors";
import Dialog from "material-ui/Dialog";
import toastr from "toastr";
import { ShareButtons, ShareCounts, generateShareIcon } from "react-share";
import { Layout, Menu, Icon, Dropdown, Button, Card, Row, Col } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { Input } from 'antd';
const Search = Input.Search;

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton
} = ShareButtons;
const {
  FacebookShareCount,
  GooglePlusShareCount,
  LinkedinShareCount
} = ShareCounts;
const FacebookIcon = generateShareIcon("facebook");
const TwitterIcon = generateShareIcon("twitter");
const GooglePlusIcon = generateShareIcon("google");
const LinkedinIcon = generateShareIcon("linkedin");

class ShareProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      showOutput: "hidden",
      allDeployed: {},
      demoBeingShown: {},
      shareModalOpen: false
    };

    this.toggleShow = this.toggleShow.bind(this);
    this.handleShareModal = this.handleShareModal.bind(this);
  }

  componentWillMount() {
    if (this.props.params.username) {
      is_cloudcv().then(data => {
        const rootData = JSON.parse(data);
        userApi
          .userProfileFromName(this.props.params.username)
          .then(userData => {
            this.setState({ user: JSON.parse(userData) }, () => {
              getAllPermalink().then(links => {
                getDeployed(this.props.params.user_id)
                  .then(alldeployedRepos => {
                    const relevantLink = JSON.parse(links).filter(
                      x => parseInt(x.user_id, 10) === this.state.user.id
                    );
                    const allDemos = [];
                    JSON.parse(alldeployedRepos).map((demo, index) => {
                      if (index < JSON.parse(alldeployedRepos).length) {
                        const demoToPut = Object.assign({}, demo, {
                          permalink: `http://${rootData.app_ip}:${rootData.port}${relevantLink[index].short_relative_url}`
                        });
                        allDemos.push(demoToPut);
                      }
                      if (
                        allDemos.length === JSON.parse(alldeployedRepos).length
                      ) {
                        this.setState({
                          allDeployed: allDemos
                        });
                      }
                    });
                  })
                  .catch(err => {
                    toastr.error(err);
                  });
              });
            });
          });
      });
    }
  }

  toggleShow() {
    this.setState({
      showOutput: this.state.showOutput === "visible" ? "hidden" : "visible"
    });
  }

  handleShareModal(demoBeingShown) {
    this.setState({ demoBeingShown }, () => {
      this.setState({ shareModalOpen: !this.state.shareModalOpen });
    });
  }

  render() {
    return (
       <Layout style={{background: '#FEFEFE'}}>
    <Header style={{ background: '#FEFEFE', padding: 0, 'box-shadow': '0px 2px 5px #E0E0E0'}} >
      <Row >
        <Col span={23} offset={1}>
          <h1>
            Public Profile
          </h1>
        </Col>
      </Row>  
    </Header>
    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
      {this.state.user &&
      <div style={{ padding: 12, background: '#FEFEFE', textAlign: 'center' }}>
        {this.state.allDeployed.length > 0 &&
        <Row>
          {this.state.allDeployed.map(demo => (
          <Col span={5} offset={1} key={demo.id}>
            <Card style={{ width: '100%', background: '#FAFAFA' }} bodyStyle={{ padding: 0 }}>
              <div className="custom-card">
                <br/>
                <h3>{demo.name}</h3>
              </div>
              <div className="custom-image">
                <img alt="example" width="100%" src="https://octodex.github.com/images/catstello.png" />
              </div>
              <div className="custom-card">
                <p>{demo.description}</p>
                <br/>
                <Row>
                  <Col span={11} offset={1}>
                    <Button type="primary" style={{width:'100%'}}>Launch<Icon type="rocket" /></Button>
                  </Col>
                  <Col span={10} offset={1}>
                    <Button type="primary" style={{width:'100%'}} onClick={() => this.handleShareModal(demo)}>Share<Icon type="share-alt" /></Button>
                  </Col>
                </Row>
                <br/>
              </div>
            </Card>
          </Col>))}
          <br/>
        </Row>}
       <br/>
      </div>}
    </Content>
    <Footer style={{ textAlign: 'center', background: '#fefefe', color:'#455A64', 'font-size' : '14px', 'box-shadow': '0px -2px 5px #E0E0E0'  }}>
      Origami - Created by Team CloudCV
    </Footer>
    <Dialog
          title="Share This Demo"
          modal={false}
          open={this.state.shareModalOpen}
          onRequestClose={this.handleShareModal}
          autoScrollBodyContent
        >

          <div className="ui padded centered grid">

            <div
              className="ui row stackable column grid"
              style={{ cursor: "pointer" }}
            >
              <TwitterShareButton
                url={this.state.demoBeingShown.permalink}
                title={this.state.demoBeingShown.name}
                hashtags={["cloudcv", "cvfy"]}
                className="ui row"
              >
                <TwitterIcon size={64} round />
              </TwitterShareButton>
            </div>

            <div
              className="ui eight wide stackable row column grid"
              style={{ cursor: "pointer" }}
            >
              <FacebookShareButton
                url={this.state.demoBeingShown.permalink}
                title={this.state.demoBeingShown.name}
                className="ui row"
              >
                <FacebookIcon size={64} round />
              </FacebookShareButton>
              <FacebookShareCount url={this.state.demoBeingShown.permalink}>
                {count => (
                  <div
                    className="ui compact inverted segment"
                    style={{ backgroundColor: indigo600 }}
                  >
                    {count} Shares
                  </div>
                )}
              </FacebookShareCount>
            </div>

            <div
              className="ui eight wide stackable row column grid"
              style={{ cursor: "pointer" }}
            >
              <GooglePlusShareButton
                url={this.state.demoBeingShown.permalink}
                className="ui row"
              >
                <GooglePlusIcon size={64} round />
              </GooglePlusShareButton>

              <GooglePlusShareCount url={this.state.demoBeingShown.permalink}>
                {count => (
                  <div className="ui compact red inverted segment">
                    {count} Shares
                  </div>
                )}
              </GooglePlusShareCount>
            </div>

            <div
              className="ui stackable row column grid"
              style={{ cursor: "pointer" }}
            >
              <LinkedinShareButton
                url={this.state.demoBeingShown.permalink}
                title={this.state.demoBeingShown.name}
                windowWidth={750}
                windowHeight={600}
                className="ui row"
              >
                <LinkedinIcon size={64} round />
              </LinkedinShareButton>

              <LinkedinShareCount url={this.state.demoBeingShown.permalink}>
                {count => (
                  <div className="ui compact blue inverted segment">
                    {count} Shares
                  </div>
                )}
              </LinkedinShareCount>
            </div>

          </div>

        </Dialog>
  </Layout>


    );
  }
}

ShareProfile.propTypes = {
  params: PropTypes.object.isRequired
};

export default ShareProfile;
