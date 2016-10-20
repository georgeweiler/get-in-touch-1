import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles.css';
import avatar from './default-avatar.png';
import { List, Map } from 'immutable';
import { Panel, Button, Glyphicon } from 'react-bootstrap';
import { requestContactDeletion } from './actions';

function groupStoriesByTopic(stories) {
  return stories
    .sortBy((story) => story.get('topic'))
    .reduce((groupsOfTopics, story) => {
      const topic = story.get('topic');
      const lastGroup = groupsOfTopics.last(); // should be a Map, or undefined if this is the first story
      // defined and not used? ---> const needToCreateNewGrouping = (lastGroup === undefined) || (lastGroup.get('topic') !== topic);

      // If we need to create a new topic grouping for this current story:
      if ((lastGroup === undefined) || (lastGroup.get('topic') !== story.get('topic'))) {
        // Create a new grouping of topics
        const newGroup = Map({ // eslint-disable-line new-cap
          topic,
          stories: List([story]), // eslint-disable-line new-cap
        });

        // Add the new topic grouping to the list of topics
        return groupsOfTopics.push(newGroup);
      }
      // Otherwise, we'll add this story to the existing final grouping of topics
      const lastGroupStories = lastGroup.get('stories');
      const updatedGroup = lastGroup.set('stories', lastGroupStories.push(story));
      return groupsOfTopics.set(-1, updatedGroup);
    }, List()); // eslint-disable-line new-cap
}

function createOptionGroups(storiesGroupedByTopic) {
  return storiesGroupedByTopic
    .map((topicGroup, i) => (
      <optgroup key={i} label={topicGroup.get('topic')}>
        {
          topicGroup.get('stories')
            .map((story, i) => ( // eslint-disable-line
              <option key={i} value={story.get('id')}>{story.get('title')}</option>
            ))
            .toArray()
        }
      </optgroup>
    ));
}

export class ContactCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  onClickContactNowToggleBar(e) {
    e.preventDefault(); // prevent normal link behavior and event bubbling
    this.setState({ expanded: !this.state.expanded });
  }

  renderComposePane() {
    const storiesGroupedByTopic = groupStoriesByTopic(this.props.stories);

    return (
      <div className={styles.notesAndCompose}>
        <div className={styles.notes}>
          <h4>Notes about {this.props.contact.get('name')}</h4>
          <textarea name="contact--notes--edit" rows="10" defaultValue={this.props.contact.get('notes')} />
        </div>
        <div className={styles.compose}>
          <h4>Compose a message</h4>
          <select>
            <option value="">-- share a story --</option>
            {createOptionGroups(storiesGroupedByTopic)}
          </select><br />
          <textarea rows="10" />
        </div>
      </div>
    );
  }

  renderOptionButtons() {
    return (
      <div className={`${styles.buttonGroup} pull-right`}>
        <Button className={styles.btnEdit}>
          <Glyphicon glyph="pencil" /> Edit
        </Button>
        <Button
          className={styles.btnDelete}
          onClick={() => this.props.requestContactDeletion(this.props.contact.get('id'))}
        >
          <Glyphicon glyph="trash" /> Delete
        </Button>
      </div>
    );
  }

  render() {
    const contactFrequency = +this.props.contact.get('contactFrequency');
    const numberOfDaysLabel = contactFrequency === 1 ?
      'day' :
      `${contactFrequency} days`;

    return (
      <Panel className={styles.contactCard}>
        <div className="container-fluid">
          <div className="row">
            <div className={`${styles.avatarColumn} col-sm-2`}>
              <img className={`${styles.avatar}`} src={avatar} alt="user avatar" />
            </div>
            <div className={`${styles.contactInfo} col-sm-10`}>
              {this.renderOptionButtons()}
              <h3 className={styles.contactName}>{this.props.contact.get('name')}</h3>
              <p className={styles.stats}>
                Contacted { this.props.contact.get('lastContacted').format('MMM D, YYYY') }<br />
                Contact every { numberOfDaysLabel }<br />
                <Button className={styles.justContacted} bsSize="small">
                  <Glyphicon glyph="ok" /> Just contacted!
                </Button>
              </p>
            </div>
          </div>
        </div>

        { /* todo: make this a link, and give a on-hover color change */}
        <div className={this.state.expanded ? styles.contactNowToggleBarExpanded : styles.contactNowToggleBar}>
          <Button onClick={(e) => this.onClickContactNowToggleBar(e)} className={styles.contactNowToggleButton} bsSize="small">
            {this.state.expanded ? 'Hide ' : 'Contact Now '}
            {this.state.expanded ? <Glyphicon glyph="chevron-up" /> : <Glyphicon glyph="chevron-down" />}
          </Button>
        </div>

        {this.state.expanded && this.renderComposePane()}

      </Panel>
    );
  }
}

ContactCard.propTypes = {
  contact: React.PropTypes.object,
  stories: React.PropTypes.object,
  requestContactDeletion: React.PropTypes.func,
};

const mapStateToProps = (state) => {
  const stories = state.get('stories');
  return { stories };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestContactDeletion }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactCard);
