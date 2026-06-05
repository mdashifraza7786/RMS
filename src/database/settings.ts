import { RowDataPacket } from 'mysql2/promise';
import dbConnect from './connection';
import { DbResponse } from '../types';

export async function getAllSettings(): Promise<DbResponse<{ [key: string]: { [key: string]: string } }>> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.query<RowDataPacket[]>(
            'SELECT setting_key, setting_value, setting_type FROM settings'
        );
        const settings: { [key: string]: { [key: string]: string } } = {};
        rows.forEach((row: any) => {
            if (!settings[row.setting_type]) settings[row.setting_type] = {};
            settings[row.setting_type][row.setting_key] = row.setting_value;
        });
        return { success: true, data: settings };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { success: false, message: 'Failed to fetch settings' };
    } finally {
        await connection.release();
    }
}

export async function getSettingsByType(settingType: string): Promise<DbResponse<{ [key: string]: string }>> {
    const connection = await dbConnect();
    try {
        const [rows] = await connection.query<RowDataPacket[]>(
            'SELECT setting_key, setting_value FROM settings WHERE setting_type = ?',
            [settingType]
        );
        const settings: { [key: string]: string } = {};
        rows.forEach((row: any) => { settings[row.setting_key] = row.setting_value; });
        return { success: true, data: settings };
    } catch (error) {
        console.error(`Error fetching ${settingType} settings:`, error);
        return { success: false, message: 'Failed to fetch settings' };
    } finally {
        await connection.release();
    }
}

export async function updateSettingsBatch(
    settings: { key: string; value: string; type?: string }[]
): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    try {
        await connection.beginTransaction();
        for (const setting of settings) {
            await connection.query(
                `INSERT INTO settings (setting_key, setting_value, setting_type)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
                [setting.key, setting.value, setting.type || 'general']
            );
        }
        await connection.commit();
        return { success: true, message: 'Settings updated successfully' };
    } catch (error) {
        await connection.rollback();
        console.error('Error updating settings:', error);
        return { success: false, message: 'Failed to update settings' };
    } finally {
        await connection.release();
    }
}

export async function updateSetting(key: string, value: string, type: string = 'general'): Promise<DbResponse<void>> {
    const connection = await dbConnect();
    try {
        await connection.query(
            `INSERT INTO settings (setting_key, setting_value, setting_type)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
            [key, value, type]
        );
        return { success: true, message: 'Setting updated successfully' };
    } catch (error) {
        console.error('Error updating setting:', error);
        return { success: false, message: 'Failed to update setting' };
    } finally {
        await connection.release();
    }
}
