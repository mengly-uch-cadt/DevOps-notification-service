// Test script to verify Telegram bot configuration
// Run with: node test-telegram.js

const TELEGRAM_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Replace with your bot token
const TELEGRAM_GROUP_ID = 'YOUR_GROUP_ID_HERE'; // Replace with your group ID (should start with -)

async function testTelegramBot() {
  console.log('🤖 Testing Telegram Bot Configuration...\n');

  // Test 1: Check bot info
  console.log('1️⃣  Checking bot info...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe`);
    const data = await response.json();

    if (data.ok) {
      console.log('✅ Bot is valid!');
      console.log(`   Bot name: ${data.result.first_name}`);
      console.log(`   Username: @${data.result.username}\n`);
    } else {
      console.log('❌ Bot token is invalid!');
      console.log(`   Error: ${data.description}\n`);
      return;
    }
  } catch (error) {
    console.log('❌ Failed to connect to Telegram API');
    console.log(`   Error: ${error.message}\n`);
    return;
  }

  // Test 2: Get updates to find chat ID
  console.log('2️⃣  Getting recent updates (to find chat IDs)...');
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates`);
    const data = await response.json();

    if (data.ok && data.result.length > 0) {
      console.log('✅ Found recent messages!');
      console.log('   Recent chat IDs:');

      const uniqueChats = new Map();
      data.result.forEach(update => {
        if (update.message && update.message.chat) {
          const chat = update.message.chat;
          uniqueChats.set(chat.id, {
            id: chat.id,
            type: chat.type,
            title: chat.title || chat.first_name || 'Private Chat'
          });
        }
      });

      uniqueChats.forEach((chat, id) => {
        console.log(`   - ID: ${id} (${chat.type}) - ${chat.title}`);
      });
      console.log();
    } else {
      console.log('⚠️  No recent messages found.');
      console.log('   💡 Send a message to your bot or add it to a group and send a message there.\n');
    }
  } catch (error) {
    console.log('❌ Failed to get updates');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 3: Try to send a test message
  console.log('3️⃣  Attempting to send test message...');
  if (!TELEGRAM_GROUP_ID || TELEGRAM_GROUP_ID === 'YOUR_GROUP_ID_HERE') {
    console.log('⚠️  Please set TELEGRAM_GROUP_ID in this script first!\n');
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_GROUP_ID,
        text: '🧪 Test message from notification service!',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      console.log('✅ Test message sent successfully!');
      console.log(`   Message ID: ${data.result.message_id}\n`);
    } else {
      console.log('❌ Failed to send message');
      console.log(`   Error: ${data.description}`);
      console.log('\n💡 Common fixes:');
      console.log('   - Make sure the bot is added to the group');
      console.log('   - Group ID should be negative (e.g., -1001234567890)');
      console.log('   - For supergroups, use the full ID including -100 prefix\n');
    }
  } catch (error) {
    console.log('❌ Failed to send message');
    console.log(`   Error: ${error.message}\n`);
  }
}

testTelegramBot();
