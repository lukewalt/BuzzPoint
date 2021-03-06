'use strict';

import {
  Text,
  View,
  TextInput,
  ListView,
  Image,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

import React, { Component } from 'react';
import styles from '../styles/styles.js';
import axios from 'axios';
import zoneCalc from './_zone-calc';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class PostsTab extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state={
      dataSource: ds,
      loaded: false,
      searchTerm: null,
      numPos: [],
      numNeg: []
    }
  }

  componentDidMount(){
    this.getAllPosts()
  }

  getAllPosts() {
    axios.get(`https://buzzpoint.herokuapp.com/api/posts`)
    .then( posts => {
      console.log("POSTS FROM REQ", posts);
      let positive = this.state.numPos
      let negative = this.state.numNeg

      posts.data.map( i => {
        i.positive ? positive.push(i.positive) : negative.push(i.positive)
      })
      // assigns user posts array of objs to variable
      let sortedPosts = posts.data
      // sorts those posts from newest to oldest
      sortedPosts.sort((a, b) => {
        return b.id - a.id
      })
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(sortedPosts),
        loaded: true,
      })

      console.log(this.state);
    })
    .done()
  }

  // looks for changes in search bar and sets state to input
  onSearchChange(text) {
    this.setState({
      searchTerm: text
    });
  }

  render(){

    // checks loading state
    if (!this.state.loaded) {
      return this.renderLoadingView()
    }

    // Full Page
    return (
      <View style={{flex: 1, alignSelf: 'stretch', marginTop: 70}}>
        <Text style={styles.tabHeader}>Posts</Text>
        <View style={styles.countContainer}>
          <View style={styles.countSection}>
            <Text style={{color: '#32a800'}}>{this.state.numPos.length}</Text>
            <Image
            style={styles.thumbcount}
            source={require('../img/thumbUpGreen.png')}
          />
          </View>
          <View style={styles.countSection}>
            <Text style={{color: '#ff5a5a'}}>{this.state.numNeg.length}</Text>
            <Image
              style={styles.thumbcount}
              source={require('../img/thumbDownRed.png')}
            />
          </View>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderPosts}
          style={styles.zonePosts}
        />
      </View>
    )

  }

  // Activity Indicator
  renderLoadingView() {
    return (
      <View style={styles.tabContainer}>
        <ActivityIndicator
          animating={true}
          size="large"
          color='#3d8af7'
        />
      </View>
    );
  }

  // List View of posts inside of page
  renderPosts(posts) {

    return (
      <View key={posts.id} style={styles.post}>
        <View style={styles.innerPost}>
          <View style={{marginRight: 10}}>
            <Image
              style={styles.thumbPost}
              source={posts.positive ? require('../img/tu.png') : require('../img/td.png')}
            />
          <Text style={styles.zoneName}> {zoneCalc(posts.zone).toUpperCase()}</Text>
          </View>
          <View style={styles.commentSect}>
            <Text style={styles.area_name}>{posts.area_name}</Text>
            <Text style={styles.postTitle}>{posts.comment}</Text>
          </View>
          <View>
            <Image style={styles.postImg} source={{uri: posts.image}}/>
          </View>
        </View>
        <View style={styles.tagSection} >
          { posts.tags.map(i => {
              return (
                <Text key={i.tag_name} style={styles.tag}>{i.tag_name}</Text>
              )
            })
          }
        </View>
      </View>
    );
  }


}
