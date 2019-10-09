/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, StyleSheet, Animated, Text, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';

import If from '~/utils/if';
import {metrics, colors} from '~/styles';

class BarcodeScan extends Component {
  state = {
    shouldRead: true,
    fadeAnim: new Animated.Value(0.2),
    boletoData: '',
  };

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.fadeAnim, {
          toValue: 1,
          duration: 1000,
        }),
        Animated.timing(this.state.fadeAnim, {
          toValue: 0.2,
          duration: 1000,
        }),
      ]),
    ).start();
  }

  onBarCodeRead = e => {
    if (e.type === 'org.ansi.Interleaved2of5') {
      this.setState({shouldRead: false, boletoData: e.data});
    } else {
      this.setState(
        {shouldRead: false, boletoData: ''},
        alert('No momento, apenas boletos de cobrança!'),
      );
    }
  };

  render() {
    const {fadeAnim, shouldRead, boletoData} = this.state;
    return (
      <>
        <View style={styles.container}>
          <If test={shouldRead}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                zIndex: 99999,
              }}>
              <View
                style={{
                  position: 'absolute',
                  width: 2,
                  height: '100%',
                  backgroundColor: colors.reddarker,
                  left: 0,
                  right: 0,
                  marginHorizontal: metrics.screenWidth / 2,
                }}
              />
            </Animated.View>
            <RNCamera
              style={styles.preview}
              onBarCodeRead={shouldRead ? this.onBarCodeRead : null}
              ref={cam => (this.camera = cam)}
            />
          </If>
          <If test={!shouldRead}>
            <View style={styles.textView}>
              <Text>{boletoData}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.setState({shouldRead: true})}>
                <Text style={styles.text}>Ler outro boleto</Text>
              </TouchableOpacity>
            </View>
          </If>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  textView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: metrics.baseMargin,
    padding: metrics.basePadding,
    backgroundColor: colors.bluedarkest,
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    color: colors.white,
  },
});

export default BarcodeScan;
