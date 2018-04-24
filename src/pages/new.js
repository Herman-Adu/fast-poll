import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { arrayMove } from 'react-sortable-hoc';
import shortId from 'short-id';

import { updateTitle } from '../store/poll/actions';
import {
  addOption,
  removeOption,
  updateOption,
  updateOptionOrder,
} from '../store/poll/options/actions';
import { selectOrderedOptions } from '../store/poll/options/selectors';

import { Button } from '../styledComponents/theme';
import { Heading2 } from '../styledComponents/typography';
import NewPoll from '../components/NewPoll/index';

const CreateButton = Button.extend`
  background-image: linear-gradient(19deg, #21d4fd 0%, #b721ff 100%);
  margin-left: 20px;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TitleContainer = styled.div`
  display: inline-flex;
  width: 350px;
  flex-direction: column;
  margin-bottom: 30px;
`;

const TitleLabel = styled.label`
  font-weight: bold;
`;

const TitleInput = styled.input`
  color: black;
  font-size: 18px;
`;

class NewPollPage extends Component {
  static contextTypes = {
    firebase: PropTypes.object,
  };

  static propTypes = {
    history: PropTypes.object.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string,
      editing: PropTypes.bool.isRequired,
      votes: PropTypes.number.isRequired
    })),
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    uid: PropTypes.string,
    title: PropTypes.string,
    signIn: PropTypes.func.isRequired,
    updateTitle: PropTypes.func.isRequired,
    addOption: PropTypes.func.isRequired,
    removeOption: PropTypes.func.isRequired,
    updateOption: PropTypes.func.isRequired,
    updateOptionOrder: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
    // to keep track of what item is being edited
    editing: null,
  };

  // to keep track of what item is being edited
  editing = null;

  handleKeydown = e => {
    if (e.which === 27) this.handleToggleEdit(this.editing);
    if (e.which === 13) this.handleAddItem();
  };

  handleToggleEdit = id => {
    const { updateOption, options, removeOption } = this.props
    const option = options.find((opt) => opt.id === id)

    updateOption(id, { editing: !option.editing })

    if (!option.text) {
      removeOption(id)
    }
  };

  handleTitleChange = e => {
    const { updateTitle } = this.props
    const { value } = e.target;

    updateTitle(value)
  };

  handleTextChange = (e, id) => {
    const { updateOption } = this.props
    const { value } = e.target
    
    updateOption(id, { text: value })
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const { updateOptionOrder, order } = this.props
    console.log('old', order)
    updateOptionOrder(arrayMove(order, oldIndex, newIndex))
  };

  handleAddItem = () => {
    const { addOption } = this.props
    const id = shortId.generate();

    this.editing = id;

    addOption(id)
  };

  handleDelete = id => {
    const { removeOption } = this.props

    removeOption(id)
  };

  handleCreate = () => {
    const pollId = shortId.generate();
    const { signIn, uid } = this.props;

    this.setState({
      loading: true,
    });

    if (!uid) {
      // due to our database rules, we can't write unless a uid exists
      signIn('anonymous').then(() => {
        this.createPoll(pollId);
      });
    } else {
      this.createPoll(pollId);
    }
  };

  createPoll(pollId) {
    const { firebase } = this.context;
    const { options } = this.state;
    const { history, title } = this.props;

    firebase.polls
      .doc(pollId)
      .set({
        title,
        id: pollId,
        options: options.map(({ text, id }) => ({ text, optionId: id })),
      })
      .then(() => {
        this.setState({
          options: [],
          loading: false,
        });

        history.push(`/poll/${pollId}`);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        // TODO: notify the user of the error
      });
  }

  render() {
    const { loading } = this.state;
    const { title, options } = this.props
    const disableCreate = !title || options.length < 2 || loading;

    return (
      <div>
        <Heading2>Create a new Poll</Heading2>
        <TitleContainer>
          <TitleLabel htmlFor="newPollTitle">Title</TitleLabel>
          <TitleInput
            id="newPollTitle"
            value={title}
            onChange={this.handleTitleChange}
            onKeyDown={this.handleKeydown}
          />
        </TitleContainer>
        <NewPoll
          options={options}
          onToggleEdit={this.handleToggleEdit}
          onTextChange={this.handleTextChange}
          onKeyDown={this.handleKeydown}
          onSortEnd={this.handleSortEnd}
          onDelete={this.handleDelete}
        />
        <ActionContainer>
          <Button
            disabled={disableCreate}
            onClick={!disableCreate && this.handleCreate}>
            {loading ? 'Creating...' : 'Create'}
          </Button>

          <CreateButton
            disabled={loading}
            onClick={!loading && this.handleAddItem}>
            Add
          </CreateButton>
        </ActionContainer>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      title: state.poll.data.title,
      order: state.poll.options.order,
      options: selectOrderedOptions(state),
      loading: state.poll.data.loading,
    };
  },
  {
    updateTitle,
    addOption,
    removeOption,
    updateOption,
    updateOptionOrder,
  },
)(NewPollPage);
