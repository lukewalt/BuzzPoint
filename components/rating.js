'use strict';

import {
  View,
  Text,
  TouchableHighlight,
  Image,
  Alert,
} from 'react-native'
import React, { Component, PropTypes } from 'react';
import styles from '../styles/styles';

import TabBar from './tabBar';
import PostIt from './postit';
import User from './user';
import TagCarousel from './tagCarousel'


export default class Rating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn,
      userId: 1,
      userLat: null,
      userLng: null,
      formattedAddress: null,
      locationERR: null
    }
    this._setTags = this._setTags.bind(this)
  }

  static propTypes = {
    title: PropTypes.string,
    navigator: PropTypes.object.isRequired,
  }

  componentDidMount() {

    this.setState({
      selectedTagIds: [],
      selectedTagNames: []
    })

    // gets current position
    navigator.geolocation.getCurrentPosition( position => {
        this.setState({
          userLat: position.coords.latitude,
          userLng: position.coords.longitude,
          locationERR: null,
        })
      },
      (error) => this.setState({ locationERR: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    )


  }

  componentWillUpdate(nextProps, nextState) {
    console.log(nextProps, nextState);
  }


  // goes to post page to finalize post
  _onToPost(boolean) {
    //checks to see if any tags have been selected
    if (this.state.selectedTagIds.length > 0) {
      this.props.navigator.push({
        component: PostIt,
        title: '',
        shadowHidden: true,
        translucent: false,
        passProps: {
          userRating: boolean,
          userLat: this.state.userLat,
          userLng: this.state.userLng,
          userId: this.state.userId,
          userTags: this.state.selectedTagIds,
          userTagNames: this.state.selectedTagNames
        }
      });
    } else {
      Alert.alert('Please Select A Tag')
    }
  }

  // goes to zones to view aggregate posts
  _onToZones = () => {
    this.props.navigator.push({
      component: TabBar,
      title: '',
      shadowHidden: true,
    });
  }
  // goes to user page
  _onToUserPage = () => {
    this.props.navigator.push({
      component: User,
      title: '',
      translucent: false,
      shadowHidden: true,
      passProps: {
        loggedIn: this.state.loggedIn,
        userId: this.state.userId,
      }
    })
  }

  //
  _setTags(tagId, tagName) {
    // set new array to state bc we reset it below
    let tagIdArray = this.state.selectedTagIds;
    let tagNameArray = this.state.selectedTagNames;
    tagIdArray.push(tagId)
    tagNameArray.push(tagName)

    // takes props from child and adds to array on state
    this.setState({
      selectedTagIds: tagIdArray,
      selectedTagNames: tagNameArray
    })
  }

  render() {
    return (
      <View style={styles.rateContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5}}>
          <TouchableHighlight  underlayColor='white' onPress={this._onToZones}>
            <Image style={styles.rateProfileImg} source={require('../img/target.png')}/>
          </TouchableHighlight>
          <Text style={styles.banner}>BuzzPoint</Text>
          <TouchableHighlight underlayColor='white' onPress={this._onToUserPage}>
            <Image style={styles.rateProfileImg} source={require('../img/profilePic.png')}/>
          </TouchableHighlight>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20}}>
          <TouchableHighlight underlayColor='white' onPress={() => {this._onToPost(true)} }>
            <Image style={styles.rateThumb} source={require('../img/thumbUpGreen.png')}/>
          </TouchableHighlight>
          <Image style={{height: 5, width: 150}} source={require('../img.subtract.png')}/>
          <TouchableHighlight underlayColor='white' onPress={() => {this._onToPost(false)} }>
            <Image style={styles.rateThumb} source={require('../img/thumbDownRed.png')}/>
          </TouchableHighlight>
        </View>
        <TagCarousel _setTags={this._setTags}/>
      </View>
    )
  }

}
// <Carousel>
