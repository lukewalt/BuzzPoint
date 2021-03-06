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

import React, { Component, PropTypes } from 'react';
import styles from '../styles/styles.js'
import axios from 'axios'

export default class TagsTab extends Component {

  constructor(props) {
    super(props);
    this.state={
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      loaded: false,
    }
    this._goToTagsPosts = this._goToTagsPosts.bind(this)
  }

  componentDidMount(){
    this.getAllPosts()
  }

  getAllPosts() {
    axios.get(`https://buzzpoint.herokuapp.com/api/tags`)
    .then( tags => {
      // defines instance of returned data
      let sortedPosts = tags.data
      // sorts tags based on length of posts array [which tag has the most posts]
      sortedPosts.sort((a, b) => {
        return b.posts.length - a.posts.length
      })

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(sortedPosts),
        loaded: true,
      })
    })
    .done()
  }

  _goToTagsPosts(tagId){
    this.props._goToTagsPosts(tagId)
  }

  render(){

    // checks loading state
    if (!this.state.loaded) {
      return this.renderLoadingView()
    }


    // Full Page
    return (
      <View style={{flex: 1, alignSelf: 'stretch'}}>

        <ListView
          dataSource={this.state.dataSource}
          renderRow= { tags => {
            // defines empty arrays to push boolean values of each post related to tag
            let numPos = [];
            let numNeg = [];
            // drills to posts obj in each tag
            tags.posts.map( i => {
              // all trues pushed into numPos | all false into numNeg
              i.positive ? numPos.push(i.positive) : numNeg.push(i.positive)
            })

            return (
              <TouchableHighlight underlayColor='white' onPress={() => {this._goToTagsPosts(tags.id)}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
                  <Text style={styles.tagPosts}>
                    {tags.tag_name}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.countSection}>
                      <Text style={{color: '#32a800'}}>{numPos.length}</Text>
                      <Image
                        style={styles.thumbcount}
                        source={require('../img/thumbUpGreen.png')}
                      />
                    </View>
                    <View style={styles.countSection}>
                      <Text style={{color: '#ff5a5a'}}>{numNeg.length}</Text>
                      <Image
                        style={styles.thumbcount}
                        source={require('../img/thumbDownRed.png')}
                      />
                    </View>

                  </View>
                </View>
              </TouchableHighlight>
            );

          }}
          style={styles.tagAggregate}
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
    )
  };


}
