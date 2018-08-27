import React from 'react';
import { AsyncStorage, Modal, Platform, StyleSheet, View } from 'react-native';
import { Constants } from 'expo';

import Feed from './screens/Feed';
import Comments from './screens/Comments';

const platformVersion = Platform.OS === 'ios' ? parseInt(Platform.Version, 10) : Platform.Version;
// arbitrary key for persisting our comments object as JSON
const ASYNC_STORAGE_COMMENTS_KEY = 'ASYNC_STORAGE_COMMENTS_KEY';

export default class App extends React.Component {
	state = {
		commentsForItem: {},
		showModal: false,
		selectedItemId: null,
	};

	openCommentScreen = id =>
		this.setState({
			showModal: true,
			selectedItemId: id,
		});

	closeCommentScreen = () =>
		this.setState({
			showModal: false,
			selectedItemId: null,
		});

	onSubmitComment = text => {
		const { selectedItemId, commentsForItem } = this.state;
		const comments = commentsForItem[selectedItemId] || [];
		const updated = {
			...commentsForItem,
			[selectedItemId]: [...comments, text],
		};

		return this.setState({ commentsForItem: updated });
	};

	render() {
		const { commentsForItem, showModal, selectedItemId } = this.state;
		return (
			<View style={styles.container}>
				<Feed
					style={styles.feed}
					commentsForItem={commentsForItem}
					onPressComments={this.openCommentScreen}
				/>
				<Modal
					visible={showModal}
					animationType="slide"
					onRequestClose={this.closeCommentScreen}
				>
					<Comments
						style={styles.container}
						comments={commentsForItem[selectedItemId] || []}
						onClose={this.closeCommentScreen}
						onSubmitComment={this.onSubmitComment}
					/>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		flex: 1,
		backgroundColor: '#fff',
	},
	feed: {
		flex: 1,
		marginTop:
			Platform.OS === 'android' || platformVersion < 11 ? Constants.statusBarHeight : 0,
	},
	comments: {
		flex: 1,
		marginTop: Platform.OS === 'ios' && platformVersion < 11 ? Constants.statusBarHeight : 0,
	},
});